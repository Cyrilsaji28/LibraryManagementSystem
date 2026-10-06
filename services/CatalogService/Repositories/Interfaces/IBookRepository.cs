using LibraryManagement.API.DTOs;
using LibraryManagement.API.Entities;

namespace LibraryManagement.API.Repositories.Interfaces;

public interface IBookRepository
{
    Task<PagedResult<BookSummaryDto>> GetBooksPagedAsync(BookSearchRequest request);
    Task<BookDetailsDto?> GetBookDetailsByIdAsync(int id);
    Task<Book?> GetBookForUpdateAsync(int id);
    Task<Book?> GetBookByIdAsync(int id);
    Task<byte[]?> GetBookRowVersionAsync(int id);
    Task AddBookAsync(Book book);
    Task<bool> SoftDeleteBookAsync(int id);

    Task<IEnumerable<BookCopyDto>> GetBookCopiesAsync(int bookId);
    Task<BookCopy?> GetBookCopyAsync(int bookId, int copyId);
    void AddBookCopy(BookCopy copy);
    void AddBookCopies(IEnumerable<BookCopy> copies);
    void DeleteBookCopy(BookCopy copy);
    Task<int> GetBookCopiesCountAsync(int bookId);
    Task<bool> BarcodeExistsAsync(string barcode);

    Task<bool> LanguageExistsAsync(int languageId);
    Task<List<int>> GetExistingAuthorIdsAsync(IEnumerable<int> authorIds);
    Task<List<int>> GetExistingCategoryIdsAsync(IEnumerable<int> categoryIds);

    void SetOriginalRowVersion(Book book, uint originalVersion);
    Task<bool> SaveChangesAsync();
}
