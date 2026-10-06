using LibraryManagement.API.DTOs;
using LibraryManagement.API.Entities;
using LibraryManagement.API.Enums;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Interfaces;

namespace LibraryManagement.API.Services.Implementations;

public class BookService : IBookService
{
    private readonly IBookRepository _bookRepository;
    private readonly ILogger<BookService> _logger;

    public BookService(IBookRepository bookRepository, ILogger<BookService> logger)
    {
        _bookRepository = bookRepository;
        _logger = logger;
    }

    public async Task<PagedResult<BookSummaryDto>> GetBooksAsync(BookSearchRequest request)
    {
        return await _bookRepository.GetBooksPagedAsync(request);
    }

    public async Task<BookDetailsDto?> GetBookByIdAsync(int id)
    {
        _logger.LogInformation("Getting book with ID: {Id}", id);
        return await _bookRepository.GetBookDetailsByIdAsync(id);
    }

    public async Task<int> CreateBookAsync(CreateBookRequest request)
    {
        // Check that the selected language exists
        var languageExists = await _bookRepository.LanguageExistsAsync(request.LanguageId);
        if (!languageExists)
        {
            throw new KeyNotFoundException("The selected language was not found.");
        }

        // Check that all selected authors exist
        var distinctAuthorIds = request.AuthorIds.Distinct().ToList();
        var existingAuthorIds = await _bookRepository.GetExistingAuthorIdsAsync(distinctAuthorIds);
        if (existingAuthorIds.Count != distinctAuthorIds.Count)
        {
            /*****/
            _logger.LogError("Author not found exceptoin");
            throw new KeyNotFoundException("One or more selected authors were not found.");
        }

        // Check that all selected categories exist
        var distinctCategoryIds = request.CategoryIds.Distinct().ToList();
        var existingCategoryIds = await _bookRepository.GetExistingCategoryIdsAsync(distinctCategoryIds);
        if (existingCategoryIds.Count != distinctCategoryIds.Count)
        {
            throw new KeyNotFoundException("One or more selected categories were not found.");
        }

        // Create the Book
        var book = new Book
        {
            Title = request.Title,
            Subtitle = request.Subtitle,
            ISBN10 = request.ISBN10 ?? string.Empty,
            ISBN13 = request.ISBN13,
            Edition = request.Edition ?? string.Empty,
            PublicationYear = request.PublicationYear,
            LanguageId = request.LanguageId,
            Summary = request.Summary ?? string.Empty,
            CoverImageUrl = request.CoverImageUrl
        };

        // Create BookAuthor relationships
        foreach (var authorId in distinctAuthorIds)
        {
            book.BookAuthors.Add(new BookAuthor
            {
                AuthorId = authorId
            });
        }

        // Create BookCategory relationships
        foreach (var categoryId in distinctCategoryIds)
        {
            book.BookCategories.Add(new BookCategory
            {
                CategoryId = categoryId
            });
        }

        // Add the book
        await _bookRepository.AddBookAsync(book);

        // Save first so the Book gets its database-generated Id
        await _bookRepository.SaveChangesAsync();

        // Create physical book copies
        for (int i = 1; i <= request.TotalCopies; i++)
        {
            book.BookCopies.Add(new BookCopy
            {
                Barcode = $"LIB-{book.Id:D4}-{i:D3}",
                Status = CopyStatus.Available
            });
        }

        // Save copies
        await _bookRepository.SaveChangesAsync();

        // Return the newly created Book ID
        return book.Id;
    }

    public async Task<byte[]?> GetBookRowVersionAsync(int id)
    {
        return await _bookRepository.GetBookRowVersionAsync(id);
    }

    public async Task<bool> UpdateBookAsync(
        int id,
        UpdateBookRequest request,
        byte[] rowVersion)
    {
        var book = await _bookRepository.GetBookForUpdateAsync(id);
        if (book == null)
            return false;

        // Tell EF which version the client originally received
        if (rowVersion.Length == sizeof(uint))
        {
            uint originalVersion = BitConverter.ToUInt32(rowVersion, 0);
            _bookRepository.SetOriginalRowVersion(book, originalVersion);
        }

        // Validate language
        var languageExists = await _bookRepository.LanguageExistsAsync(request.LanguageId);
        if (!languageExists)
        {
            throw new KeyNotFoundException("The selected language was not found.");
        }

        // Validate authors
        var authorIds = request.AuthorIds.Distinct().ToList();
        var existingAuthorIds = await _bookRepository.GetExistingAuthorIdsAsync(authorIds);
        if (existingAuthorIds.Count != authorIds.Count)
        {
            throw new KeyNotFoundException("One or more selected authors were not found.");
        }

        // Validate categories
        var categoryIds = request.CategoryIds.Distinct().ToList();
        var existingCategoryIds = await _bookRepository.GetExistingCategoryIdsAsync(categoryIds);
        if (existingCategoryIds.Count != categoryIds.Count)
        {
            throw new KeyNotFoundException("One or more selected categories were not found.");
        }

        // Update basic book information
        book.Title = request.Title;
        book.Subtitle = request.Subtitle;
        book.ISBN10 = request.ISBN10 ?? string.Empty;
        book.ISBN13 = request.ISBN13;
        book.Edition = request.Edition ?? string.Empty;
        book.PublicationYear = request.PublicationYear;
        book.LanguageId = request.LanguageId;
        book.Summary = request.Summary ?? string.Empty;
        book.CoverImageUrl = request.CoverImageUrl;

        // Remove old author relationships
        book.BookAuthors.Clear();

        // Add new authors
        foreach (var authorId in authorIds)
        {
            book.BookAuthors.Add(new BookAuthor
            {
                BookId = book.Id,
                AuthorId = authorId
            });
        }

        // Remove old category relationships
        book.BookCategories.Clear();

        // Add new categories
        foreach (var categoryId in categoryIds)
        {
            book.BookCategories.Add(new BookCategory
            {
                BookId = book.Id,
                CategoryId = categoryId
            });
        }

        return await _bookRepository.SaveChangesAsync();
    }

    public async Task<bool> DeleteBookAsync(int id)
    {
        return await _bookRepository.SoftDeleteBookAsync(id);
    }

    public async Task<IEnumerable<BookCopyDto>> GetBookCopiesAsync(int bookId)
    {
        return await _bookRepository.GetBookCopiesAsync(bookId);
    }

    public async Task<IEnumerable<BookCopyDto>> AddBookCopiesAsync(int bookId, AddBookCopyRequest request)
    {
        var book = await _bookRepository.GetBookByIdAsync(bookId);
        if (book == null)
            throw new KeyNotFoundException("Book not found.");

        var countToAdd = Math.Max(1, Math.Min(50, request.Count));
        var addedCopies = new List<BookCopy>();

        if (!string.IsNullOrWhiteSpace(request.CustomBarcode))
        {
            var customBarcode = request.CustomBarcode.Trim();
            var exists = await _bookRepository.BarcodeExistsAsync(customBarcode);
            if (exists)
                throw new InvalidOperationException($"Barcode '{customBarcode}' is already assigned to another copy.");

            var copy = new BookCopy
            {
                BookId = bookId,
                Barcode = customBarcode,
                Status = CopyStatus.Available
            };

            _bookRepository.AddBookCopy(copy);
            addedCopies.Add(copy);
        }
        else
        {
            var existingCount = await _bookRepository.GetBookCopiesCountAsync(bookId);
            for (int i = 1; i <= countToAdd; i++)
            {
                var candidateBarcode = $"LIB-{bookId:D4}-{existingCount + i:D3}";
                var exists = await _bookRepository.BarcodeExistsAsync(candidateBarcode);
                if (exists)
                {
                    candidateBarcode = $"LIB-{bookId:D4}-{DateTime.UtcNow.Ticks % 1000000:D6}-{i:D2}";
                }

                var copy = new BookCopy
                {
                    BookId = bookId,
                    Barcode = candidateBarcode,
                    Status = CopyStatus.Available
                };
                _bookRepository.AddBookCopy(copy);
                addedCopies.Add(copy);
            }
        }

        await _bookRepository.SaveChangesAsync();

        return addedCopies.Select(c => new BookCopyDto
        {
            Id = c.Id,
            Barcode = c.Barcode,
            Status = c.Status,
            BookId = c.BookId
        });
    }

    public async Task<bool> UpdateBookCopyStatusAsync(int bookId, int copyId, CopyStatus status)
    {
        var copy = await _bookRepository.GetBookCopyAsync(bookId, copyId);
        if (copy == null)
            return false;

        copy.Status = status;
        await _bookRepository.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBookCopyAsync(int bookId, int copyId)
    {
        var copy = await _bookRepository.GetBookCopyAsync(bookId, copyId);
        if (copy == null)
            return false;

        _bookRepository.DeleteBookCopy(copy);
        await _bookRepository.SaveChangesAsync();
        return true;
    }
}
