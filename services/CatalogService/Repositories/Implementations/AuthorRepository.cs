using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Enums;
using LibraryManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories.Implementations;

public class AuthorRepository : IAuthorRepository
{
    private readonly CatalogDbContext _context;

    public AuthorRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AuthorDto>> GetAuthorsAsync(string? search)
    {
        var query = _context.Authors.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(a =>
                (a.FirstName + " " + a.LastName).ToLower().Contains(s));
        }

        return await query
            .OrderBy(a => a.FirstName)
            .Select(a => new AuthorDto
            {
                Id = a.Id,
                FullName = a.FirstName + " " + a.LastName,
                Biography = a.Biography,
                BookCount = a.BookAuthors.Count(ba => !ba.Book.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<AuthorDetailsDto?> GetAuthorByIdAsync(int id)
    {
        return await _context.Authors
            .Include(a => a.BookAuthors)
                .ThenInclude(ba => ba.Book)
                    .ThenInclude(b => b.Language)
            .Include(a => a.BookAuthors)
                .ThenInclude(ba => ba.Book)
                    .ThenInclude(b => b.BookCopies)
            .Where(a => a.Id == id)
            .Select(a => new AuthorDetailsDto
            {
                Id = a.Id,
                FirstName = a.FirstName,
                LastName = a.LastName,
                Biography = a.Biography,
                Books = a.BookAuthors
                    .Select(ba => new BookSummaryDto
                    {
                        Id = ba.Book.Id,
                        Title = ba.Book.Title,
                        Subtitle = ba.Book.Subtitle,
                        ISBN13 = ba.Book.ISBN13,
                        PublicationYear = ba.Book.PublicationYear,
                        Language = ba.Book.Language.Name,
                        CoverImageUrl = ba.Book.CoverImageUrl,
                        TotalCopies = ba.Book.BookCopies.Count,
                        AvailableCopies = ba.Book.BookCopies.Count(c =>
                            c.Status == CopyStatus.Available)
                    })
                    .OrderBy(b => b.PublicationYear)
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<BookSummaryDto>> GetBooksByAuthorAsync(int id)
    {
        return await _context.BookAuthors
            .Where(ba => ba.AuthorId == id)
            .Select(ba => new BookSummaryDto
            {
                Id = ba.Book.Id,
                Title = ba.Book.Title,
                Subtitle = ba.Book.Subtitle,
                ISBN13 = ba.Book.ISBN13,
                PublicationYear = ba.Book.PublicationYear,
                Language = ba.Book.Language.Name,
                CoverImageUrl = ba.Book.CoverImageUrl,
                TotalCopies = ba.Book.BookCopies.Count,
                AvailableCopies = ba.Book.BookCopies.Count(c =>
                    c.Status == CopyStatus.Available)
            })
            .ToListAsync();
    }
}
