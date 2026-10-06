using LibraryManagement.Services.Borrowing.DTOs;
using LibraryManagement.Services.Borrowing.Entities;
using LibraryManagement.Services.Borrowing.Enums;
using LibraryManagement.Services.Borrowing.Repositories;

namespace LibraryManagement.Services.Borrowing.Services;

public class BorrowingService : IBorrowingService
{
    private readonly ILoanRepository _loanRepository;
    private readonly ILogger<BorrowingService> _logger;

    public BorrowingService(ILoanRepository loanRepository, ILogger<BorrowingService> logger)
    {
        _loanRepository = loanRepository;
        _logger = logger;
    }

    public async Task<LoanResponseDto> CreateLoanRequestAsync(
        int userId,
        string userFullName,
        string userEmail,
        CreateLoanRequestDto dto)
    {
        if (dto.RequestedDays < 1 || dto.RequestedDays > 60)
        {
            throw new ArgumentException("Loan duration must be between 1 and 60 days.");
        }

        var hasActive = await _loanRepository.HasActiveLoanForBookAsync(userId, dto.BookId);
        if (hasActive)
        {
            throw new InvalidOperationException("You already have an active loan or pending request for this book.");
        }

        var loan = new Loan
        {
            UserId = userId,
            UserFullName = userFullName,
            UserEmail = userEmail,
            BookId = dto.BookId,
            BookTitle = dto.BookTitle,
            RequestedDays = dto.RequestedDays,
            RequestedAt = DateTime.UtcNow,
            Status = LoanStatus.Pending
        };

        await _loanRepository.AddAsync(loan);
        await _loanRepository.SaveChangesAsync();

        _logger.LogInformation("Loan request created: Id={LoanId}, User={UserId}, Book={BookId}", loan.Id, userId, dto.BookId);

        return MapToDto(loan);
    }

    public async Task<LoanResponseDto> ApproveLoanAsync(int loanId, int librarianId, ApproveLoanDto dto)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);
        if (loan == null)
        {
            throw new KeyNotFoundException($"Loan request with ID {loanId} was not found.");
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new InvalidOperationException($"Cannot approve a loan with status '{loan.Status}'. Only pending requests can be approved.");
        }

        // Assign copy and update copy status in catalog.BookCopies to OnLoan
        var assignedCopyId = await _loanRepository.AssignAndMarkCopyOnLoanAsync(loan.BookId, dto.BookCopyId);

        loan.Status = LoanStatus.Approved;
        loan.ApprovedByLibrarianId = librarianId;
        loan.ReviewedAt = DateTime.UtcNow;
        loan.DueDate = DateTime.UtcNow.AddDays(loan.RequestedDays);
        loan.BookCopyId = assignedCopyId;

        if (!string.IsNullOrWhiteSpace(dto.Remarks))
        {
            loan.ReviewRemarks = dto.Remarks;
        }

        await _loanRepository.SaveChangesAsync();

        _logger.LogInformation("Loan approved: Id={LoanId}, CopyId={CopyId}, Librarian={LibrarianId}, DueDate={DueDate}",
            loan.Id, assignedCopyId, librarianId, loan.DueDate);

        return MapToDto(loan);
    }

    public async Task<LoanResponseDto> RejectLoanAsync(int loanId, int librarianId, RejectLoanDto dto)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);
        if (loan == null)
        {
            throw new KeyNotFoundException($"Loan request with ID {loanId} was not found.");
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new InvalidOperationException($"Cannot reject a loan with status '{loan.Status}'. Only pending requests can be rejected.");
        }

        loan.Status = LoanStatus.Rejected;
        loan.ApprovedByLibrarianId = librarianId;
        loan.ReviewedAt = DateTime.UtcNow;
        loan.ReviewRemarks = dto.Reason;

        await _loanRepository.SaveChangesAsync();

        _logger.LogInformation("Loan rejected: Id={LoanId}, Librarian={LibrarianId}, Reason={Reason}", loan.Id, librarianId, dto.Reason);

        return MapToDto(loan);
    }

    public async Task<LoanResponseDto> ReturnLoanAsync(int loanId, int librarianId, string? remarks = null)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);
        if (loan == null)
        {
            throw new KeyNotFoundException($"Loan with ID {loanId} was not found.");
        }

        if (loan.Status != LoanStatus.Approved)
        {
            throw new InvalidOperationException($"Cannot mark loan as returned when status is '{loan.Status}'. Loan must be currently approved.");
        }

        // Return copy back to Available in catalog.BookCopies
        if (loan.BookCopyId.HasValue)
        {
            await _loanRepository.MarkCopyAvailableAsync(loan.BookCopyId.Value);
        }

        loan.Status = LoanStatus.Returned;
        loan.ReturnedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(remarks))
        {
            loan.ReviewRemarks = remarks;
        }

        await _loanRepository.SaveChangesAsync();

        _logger.LogInformation("Loan marked as returned: Id={LoanId}, CopyId={CopyId}, ReturnedAt={ReturnedAt}",
            loan.Id, loan.BookCopyId, loan.ReturnedAt);

        return MapToDto(loan);
    }

    public async Task<LoanResponseDto> CancelLoanRequestAsync(int loanId, int userId)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);
        if (loan == null)
        {
            throw new KeyNotFoundException($"Loan request with ID {loanId} was not found.");
        }

        if (loan.UserId != userId)
        {
            throw new UnauthorizedAccessException("You are not authorized to cancel this loan request.");
        }

        if (loan.Status != LoanStatus.Pending)
        {
            throw new InvalidOperationException("Only pending loan requests can be cancelled.");
        }

        loan.Status = LoanStatus.Cancelled;
        await _loanRepository.SaveChangesAsync();

        _logger.LogInformation("Loan cancelled by user: Id={LoanId}, User={UserId}", loan.Id, userId);

        return MapToDto(loan);
    }

    public async Task<IEnumerable<LoanResponseDto>> GetUserLoansAsync(int userId)
    {
        var loans = await _loanRepository.GetByUserIdAsync(userId);
        return loans.Select(MapToDto);
    }

    public async Task<IEnumerable<LoanResponseDto>> GetAllLoansAsync(LoanStatus? status = null)
    {
        var loans = await _loanRepository.GetAllAsync(status);
        return loans.Select(MapToDto);
    }

    public async Task<LoanResponseDto> GetLoanByIdAsync(int loanId)
    {
        var loan = await _loanRepository.GetByIdAsync(loanId);
        if (loan == null)
        {
            throw new KeyNotFoundException($"Loan with ID {loanId} was not found.");
        }

        return MapToDto(loan);
    }

    private static LoanResponseDto MapToDto(Loan loan)
    {
        return new LoanResponseDto
        {
            Id = loan.Id,
            UserId = loan.UserId,
            UserFullName = loan.UserFullName,
            UserEmail = loan.UserEmail,
            BookId = loan.BookId,
            BookTitle = loan.BookTitle,
            BookCopyId = loan.BookCopyId,
            RequestedAt = loan.RequestedAt,
            RequestedDays = loan.RequestedDays,
            DueDate = loan.DueDate,
            ReturnedAt = loan.ReturnedAt,
            Status = loan.Status.ToString(),
            ApprovedByLibrarianId = loan.ApprovedByLibrarianId,
            ReviewedAt = loan.ReviewedAt,
            ReviewRemarks = loan.ReviewRemarks
        };
    }
}
