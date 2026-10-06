using LibraryManagement.Services.Borrowing.DTOs;
using LibraryManagement.Services.Borrowing.Enums;

namespace LibraryManagement.Services.Borrowing.Services;

public interface IBorrowingService
{
    Task<LoanResponseDto> CreateLoanRequestAsync(int userId, string userFullName, string userEmail, CreateLoanRequestDto dto);
    Task<LoanResponseDto> ApproveLoanAsync(int loanId, int librarianId, ApproveLoanDto dto);
    Task<LoanResponseDto> RejectLoanAsync(int loanId, int librarianId, RejectLoanDto dto);
    Task<LoanResponseDto> ReturnLoanAsync(int loanId, int librarianId, string? remarks = null);
    Task<LoanResponseDto> CancelLoanRequestAsync(int loanId, int userId);
    Task<IEnumerable<LoanResponseDto>> GetUserLoansAsync(int userId);
    Task<IEnumerable<LoanResponseDto>> GetAllLoansAsync(LoanStatus? status = null);
    Task<LoanResponseDto> GetLoanByIdAsync(int loanId);
}
