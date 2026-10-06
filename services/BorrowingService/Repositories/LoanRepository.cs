using LibraryManagement.Services.Borrowing.Data;
using LibraryManagement.Services.Borrowing.Entities;
using LibraryManagement.Services.Borrowing.Enums;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Services.Borrowing.Repositories;

public class LoanRepository : ILoanRepository
{
    private readonly BorrowingDbContext _context;

    public LoanRepository(BorrowingDbContext context)
    {
        _context = context;
    }

    public async Task<Loan?> GetByIdAsync(int id)
    {
        return await _context.Loans.FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<IEnumerable<Loan>> GetAllAsync(LoanStatus? status = null)
    {
        await SyncOverdueCopiesAsync();

        var query = _context.Loans.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(l => l.Status == status.Value);
        }

        return await query.OrderByDescending(l => l.RequestedAt).ToListAsync();
    }

    public async Task<IEnumerable<Loan>> GetByUserIdAsync(int userId)
    {
        await SyncOverdueCopiesAsync();

        return await _context.Loans
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.RequestedAt)
            .ToListAsync();
    }

    public async Task<bool> HasActiveLoanForBookAsync(int userId, int bookId)
    {
        return await _context.Loans.AnyAsync(l =>
            l.UserId == userId &&
            l.BookId == bookId &&
            (l.Status == LoanStatus.Pending || l.Status == LoanStatus.Approved));
    }

    public async Task<int> AssignAndMarkCopyOnLoanAsync(int bookId, int? requestedCopyId)
    {
        int copyIdToAssign;

        if (requestedCopyId.HasValue && requestedCopyId.Value > 0)
        {
            var copyStatuses = await _context.Database
                .SqlQueryRaw<int>("SELECT \"Status\" FROM catalog.\"BookCopies\" WHERE \"Id\" = {0} AND \"BookId\" = {1}", requestedCopyId.Value, bookId)
                .ToListAsync();

            if (!copyStatuses.Any())
            {
                throw new InvalidOperationException($"Copy #{requestedCopyId.Value} was not found for this book.");
            }

            if (copyStatuses.First() != 0) // 0 is CopyStatus.Available
            {
                throw new InvalidOperationException($"Copy #{requestedCopyId.Value} is not available (Current status code: {copyStatuses.First()}).");
            }

            copyIdToAssign = requestedCopyId.Value;
        }
        else
        {
            var availableCopies = await _context.Database
                .SqlQueryRaw<int>("SELECT \"Id\" FROM catalog.\"BookCopies\" WHERE \"BookId\" = {0} AND \"Status\" = 0 ORDER BY \"Id\" LIMIT 1", bookId)
                .ToListAsync();

            if (!availableCopies.Any())
            {
                throw new InvalidOperationException("Cannot approve loan: No available copies left for this book.");
            }

            copyIdToAssign = availableCopies.First();
        }

        // Set status to OnLoan (1)
        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE catalog.\"BookCopies\" SET \"Status\" = 1 WHERE \"Id\" = {copyIdToAssign}"
        );

        return copyIdToAssign;
    }

    public async Task MarkCopyAvailableAsync(int copyId)
    {
        await _context.Database.ExecuteSqlInterpolatedAsync(
            $"UPDATE catalog.\"BookCopies\" SET \"Status\" = 0 WHERE \"Id\" = {copyId}"
        );
    }

    public async Task SyncOverdueCopiesAsync()
    {
        try
        {
            // 1. Mark copies as Overdue (2) where an approved loan has passed its DueDate
            await _context.Database.ExecuteSqlRawAsync(@"
                UPDATE catalog.""BookCopies"" bc
                SET ""Status"" = 2
                FROM borrowing.""Loans"" l
                WHERE l.""BookCopyId"" = bc.""Id""
                  AND l.""Status"" = 2 -- Approved
                  AND l.""DueDate"" < NOW()
                  AND bc.""Status"" != 2;
            ");

            // 2. Mark copies as OnLoan (1) if an approved loan is NOT overdue yet
            await _context.Database.ExecuteSqlRawAsync(@"
                UPDATE catalog.""BookCopies"" bc
                SET ""Status"" = 1
                FROM borrowing.""Loans"" l
                WHERE l.""BookCopyId"" = bc.""Id""
                  AND l.""Status"" = 2 -- Approved
                  AND l.""DueDate"" >= NOW()
                  AND bc.""Status"" != 1;
            ");
        }
        catch
        {
            // Ignore if catalog schema is not yet accessible
        }
    }

    public async Task AddAsync(Loan loan)
    {
        await _context.Loans.AddAsync(loan);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
