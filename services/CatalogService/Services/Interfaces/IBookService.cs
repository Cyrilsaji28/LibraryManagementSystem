using LibraryManagement.API.DTOs;
using LibraryManagement.API.Enums;

namespace LibraryManagement.API.Services.Interfaces;

public interface IBookService
{
    Task<PagedResult<BookSummaryDto>> GetBooksAsync(BookSearchRequest request);

    Task<BookDetailsDto?> GetBookByIdAsync(int id);
    Task<int> CreateBookAsync(CreateBookRequest request);

    Task<byte[]?> GetBookRowVersionAsync(int id);

    Task<bool> UpdateBookAsync(
        int id,
        UpdateBookRequest request,
        byte[] rowVersion);

    Task<bool> DeleteBookAsync(int id);

    Task<IEnumerable<BookCopyDto>> GetBookCopiesAsync(int bookId);

    Task<IEnumerable<BookCopyDto>> AddBookCopiesAsync(int bookId, AddBookCopyRequest request);

    Task<bool> UpdateBookCopyStatusAsync(int bookId, int copyId, CopyStatus status);

    Task<bool> DeleteBookCopyAsync(int bookId, int copyId);
}