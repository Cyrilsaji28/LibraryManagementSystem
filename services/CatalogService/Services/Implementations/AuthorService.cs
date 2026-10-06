using LibraryManagement.API.DTOs;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;

namespace LibraryManagement.API.Services.Implementations;

public class AuthorService : IAuthorService
{
    private readonly IAuthorRepository _authorRepository;

    public AuthorService(IAuthorRepository authorRepository)
    {
        _authorRepository = authorRepository;
    }

    public async Task<IEnumerable<AuthorDto>> GetAuthorsAsync(string? search)
    {
        return await _authorRepository.GetAuthorsAsync(search);
    }

    public async Task<AuthorDetailsDto?> GetAuthorByIdAsync(int id)
    {
        return await _authorRepository.GetAuthorByIdAsync(id);
    }

    public async Task<IEnumerable<BookSummaryDto>> GetBooksByAuthorAsync(int id)
    {
        return await _authorRepository.GetBooksByAuthorAsync(id);
    }
}