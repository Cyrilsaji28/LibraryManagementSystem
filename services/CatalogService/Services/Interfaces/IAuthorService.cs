using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Services.Interfaces;

public interface IAuthorService
{
    Task<IEnumerable<AuthorDto>> GetAuthorsAsync(string? search);

    Task<AuthorDetailsDto?> GetAuthorByIdAsync(int id);

    Task<IEnumerable<BookSummaryDto>> GetBooksByAuthorAsync(int id);
}