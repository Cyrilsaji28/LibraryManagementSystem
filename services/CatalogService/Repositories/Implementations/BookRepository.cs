using LibraryManagement.API.Data;
using LibraryManagement.API.DTOs;
using LibraryManagement.API.Entities;
using LibraryManagement.API.Enums;
using LibraryManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories.Implementations;

public class BookRepository : IBookRepository
{
    private readonly CatalogDbContext _context;

    public BookRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResult<BookSummaryDto>> GetBooksPagedAsync(BookSearchRequest request)
    {
        var query = _context.Books
            .Include(b => b.Language)
            .Include(b => b.BookCopies)
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
            .AsQueryable();

        // Keyword Search
        if (!string.IsNullOrWhiteSpace(request.Q))
        {
            var searchTerm = request.Q.Trim().ToLower();
            query = query.Where(b =>
                b.Title.ToLower().Contains(searchTerm) ||
                (b.Subtitle != null && b.Subtitle.ToLower().Contains(searchTerm))
            );
        }

        // ISBN Filter
        if (!string.IsNullOrWhiteSpace(request.ISBN))
        {
            query = query.Where(b =>
                b.ISBN10 == request.ISBN ||
                b.ISBN13 == request.ISBN);
        }

        // Author Filter
        if (!string.IsNullOrWhiteSpace(request.Author))
        {
            query = query.Where(b =>
                b.BookAuthors.Any(ba =>
                    (ba.Author.FirstName + " " + ba.Author.LastName)
                    .Contains(request.Author)));
        }

        // Category Filter
        if (!string.IsNullOrWhiteSpace(request.Category))
        {
            query = query.Where(b =>
                b.BookCategories.Any(bc =>
                    bc.Category.Name == request.Category));
        }

        // Language Filter
        if (!string.IsNullOrWhiteSpace(request.Language))
        {
            query = query.Where(b =>
                b.Language.Name == request.Language);
        }

        // Availability Filter
        if (request.AvailableOnly == true)
        {
            query = query.Where(b =>
                b.BookCopies.Any(c =>
                    c.Status == CopyStatus.Available));
        }

        var totalItems = await query.CountAsync();

        // Sorting
        query = request.SortBy.ToLower() switch
        {
            "year" => request.Descending
                ? query.OrderByDescending(b => b.PublicationYear)
                : query.OrderBy(b => b.PublicationYear),

            _ => request.Descending
                ? query.OrderByDescending(b => b.Title)
                : query.OrderBy(b => b.Title)
        };

        // Pagination
        query = query
            .Skip((request.Page - 1) * request.Size)
            .Take(request.Size);

        var books = await query
            .Select(b => new BookSummaryDto
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                ISBN13 = b.ISBN13,
                PublicationYear = b.PublicationYear,
                Language = b.Language.Name,
                CoverImageUrl = b.CoverImageUrl,
                TotalCopies = b.BookCopies.Count(),
                AvailableCopies = b.BookCopies.Count(c =>
                    c.Status == CopyStatus.Available)
            })
            .ToListAsync();

        return new PagedResult<BookSummaryDto>
        {
            Items = books,
            Page = request.Page,
            Size = request.Size,
            TotalItems = totalItems,
            TotalPages = (int)Math.Ceiling(totalItems / (double)request.Size)
        };
    }

    public async Task<BookDetailsDto?> GetBookDetailsByIdAsync(int id)
    {
        await SyncOverdueCopiesAsync();

        return await _context.Books
            .Include(b => b.Language)
            .Include(b => b.BookCopies)
            .Include(b => b.BookAuthors)
                .ThenInclude(ba => ba.Author)
            .Include(b => b.BookCategories)
                .ThenInclude(bc => bc.Category)
            .Where(b => b.Id == id)
            .Select(b => new BookDetailsDto
            {
                Id = b.Id,
                Title = b.Title,
                Subtitle = b.Subtitle,
                ISBN10 = b.ISBN10,
                ISBN13 = b.ISBN13,
                Edition = b.Edition,
                PublicationYear = b.PublicationYear,
                Language = b.Language.Name,
                Summary = b.Summary,
                CoverImageUrl = b.CoverImageUrl,
                Authors = b.BookAuthors
                    .Select(ba => new BookAuthorDto
                    {
                        Id = ba.Author.Id,
                        Name = ba.Author.FirstName + " " + ba.Author.LastName
                    })
                    .ToList(),
                Categories = b.BookCategories
                    .Select(bc => bc.Category.Name)
                    .ToList(),
                TotalCopies = b.BookCopies.Count(),
                AvailableCopies = b.BookCopies.Count(c =>
                    c.Status == CopyStatus.Available),
                OnLoanCopies = b.BookCopies.Count(c =>
                    c.Status == CopyStatus.OnLoan),
                OverdueCopies = b.BookCopies.Count(c =>
                    c.Status == CopyStatus.Overdue)
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Book?> GetBookForUpdateAsync(int id)
    {
        return await _context.Books
            .Include(b => b.BookAuthors)
            .Include(b => b.BookCategories)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Book?> GetBookByIdAsync(int id)
    {
        return await _context.Books
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<byte[]?> GetBookRowVersionAsync(int id)
    {
        var version = await _context.Books
            .Where(b => b.Id == id)
            .Select(b => (uint?)b.Version)
            .FirstOrDefaultAsync();

        return version.HasValue ? BitConverter.GetBytes(version.Value) : null;
    }

    public async Task AddBookAsync(Book book)
    {
        await _context.Books.AddAsync(book);
    }

    public async Task<bool> SoftDeleteBookAsync(int id)
    {
        var book = await _context.Books
            .FirstOrDefaultAsync(b => b.Id == id);

        if (book == null)
            return false;

        book.IsDeleted = true;
        book.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<BookCopyDto>> GetBookCopiesAsync(int bookId)
    {
        await SyncOverdueCopiesAsync();

        return await _context.BookCopies
            .Where(bc => bc.BookId == bookId)
            .OrderBy(bc => bc.Id)
            .Select(bc => new BookCopyDto
            {
                Id = bc.Id,
                Barcode = bc.Barcode,
                Status = bc.Status,
                BookId = bc.BookId
            })
            .ToListAsync();
    }

    public async Task<BookCopy?> GetBookCopyAsync(int bookId, int copyId)
    {
        return await _context.BookCopies
            .FirstOrDefaultAsync(bc => bc.Id == copyId && bc.BookId == bookId);
    }

    public void AddBookCopy(BookCopy copy)
    {
        _context.BookCopies.Add(copy);
    }

    public void AddBookCopies(IEnumerable<BookCopy> copies)
    {
        _context.BookCopies.AddRange(copies);
    }

    public void DeleteBookCopy(BookCopy copy)
    {
        _context.BookCopies.Remove(copy);
    }

    public async Task<int> GetBookCopiesCountAsync(int bookId)
    {
        return await _context.BookCopies.CountAsync(bc => bc.BookId == bookId);
    }

    public async Task<bool> BarcodeExistsAsync(string barcode)
    {
        return await _context.BookCopies.AnyAsync(bc => bc.Barcode.ToLower() == barcode.ToLower());
    }

    public async Task<bool> LanguageExistsAsync(int languageId)
    {
        return await _context.Languages.AnyAsync(l => l.Id == languageId);
    }

    public async Task<List<int>> GetExistingAuthorIdsAsync(IEnumerable<int> authorIds)
    {
        return await _context.Authors
            .Where(a => authorIds.Contains(a.Id))
            .Select(a => a.Id)
            .ToListAsync();
    }

    public async Task<List<int>> GetExistingCategoryIdsAsync(IEnumerable<int> categoryIds)
    {
        return await _context.Categories
            .Where(c => categoryIds.Contains(c.Id))
            .Select(c => c.Id)
            .ToListAsync();
    }

    public void SetOriginalRowVersion(Book book, uint originalVersion)
    {
        _context.Entry(book).Property(b => b.Version).OriginalValue = originalVersion;
    }

    public async Task<bool> SaveChangesAsync()
    {
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    private async Task SyncOverdueCopiesAsync()
    {
        try
        {
            await _context.Database.ExecuteSqlRawAsync(@"
                UPDATE catalog.""BookCopies"" bc
                SET ""Status"" = 2
                FROM borrowing.""Loans"" l
                WHERE l.""BookCopyId"" = bc.""Id""
                  AND l.""Status"" = 2
                  AND l.""DueDate"" < NOW()
                  AND bc.""Status"" != 2;
            ");
        }
        catch
        {
            // Ignore if borrowing schema is not accessible
        }
    }
}
