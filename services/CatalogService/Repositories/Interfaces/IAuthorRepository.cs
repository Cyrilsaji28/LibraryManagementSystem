using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Repositories.Interfaces;

public interface IAuthorRepository
{
    Task<IEnumerable<AuthorDto>> GetAuthorsAsync(string? search);
    Task<AuthorDetailsDto?> GetAuthorByIdAsync(int id);
    Task<IEnumerable<BookSummaryDto>> GetBooksByAuthorAsync(int id);
}
