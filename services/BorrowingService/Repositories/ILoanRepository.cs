using LibraryManagement.Services.Borrowing.Entities;
using LibraryManagement.Services.Borrowing.Enums;

namespace LibraryManagement.Services.Borrowing.Repositories;

public interface ILoanRepository
{
    Task<Loan?> GetByIdAsync(int id);
    Task<IEnumerable<Loan>> GetAllAsync(LoanStatus? status = null);
    Task<IEnumerable<Loan>> GetByUserIdAsync(int userId);
    Task<bool> HasActiveLoanForBookAsync(int userId, int bookId);
    Task<int> AssignAndMarkCopyOnLoanAsync(int bookId, int? requestedCopyId);
    Task MarkCopyAvailableAsync(int copyId);
    Task SyncOverdueCopiesAsync();
    Task AddAsync(Loan loan);
    Task SaveChangesAsync();
}
