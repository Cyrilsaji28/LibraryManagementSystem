using System.Text.Json;
using LibraryManagement.API.Entities;
using LibraryManagement.API.Enums;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Data;

public static class CatalogDbSeeder
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();

        await context.Database.MigrateAsync();

        if (await context.Books.AnyAsync())
            return;

        await using var transaction = await context.Database.BeginTransactionAsync();

        try
        {
            var seedPath = Path.Combine(AppContext.BaseDirectory, "Data", "SeedData", "seed-data.json");
            if (!File.Exists(seedPath))
            {
                seedPath = Path.Combine(Directory.GetCurrentDirectory(), "Data", "SeedData", "seed-data.json");
            }

            if (!File.Exists(seedPath))
            {
                throw new FileNotFoundException($"Seed file not found at: {seedPath}");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var seedData = JsonSerializer.Deserialize<SeedDataPayload>(
                await File.ReadAllTextAsync(seedPath),
                options) ?? throw new InvalidOperationException("Failed to deserialize seed-data.json");

            // 1. Seed Languages
            if (seedData.Languages?.Count > 0)
            {
                foreach (var lang in seedData.Languages)
                {
                    context.Languages.Add(new Language { Name = lang.Name });
                }
                await context.SaveChangesAsync();
            }
            var languageMap = await context.Languages.ToDictionaryAsync(l => l.Name.Trim().ToLower(), l => l.Id);

            // 2. Seed Categories
            if (seedData.Categories?.Count > 0)
            {
                foreach (var cat in seedData.Categories)
                {
                    context.Categories.Add(new Category { Name = cat.Name });
                }
                await context.SaveChangesAsync();
            }
            var categoryMap = await context.Categories.ToDictionaryAsync(c => c.Name.Trim().ToLower(), c => c.Id);

            // 3. Seed Authors
            if (seedData.Authors?.Count > 0)
            {
                foreach (var auth in seedData.Authors)
                {
                    context.Authors.Add(new Author
                    {
                        FirstName = auth.FirstName,
                        LastName = auth.LastName,
                        Biography = auth.Biography
                    });
                }
                await context.SaveChangesAsync();
            }
            var authorMap = await context.Authors.ToDictionaryAsync(
                a => (a.FirstName.Trim() + " " + a.LastName.Trim()).ToLower(),
                a => a.Id);

            // 4. Seed Books
            if (seedData.Books?.Count > 0)
            {
                foreach (var bookSeed in seedData.Books)
                {
                    var cleanLang = bookSeed.Language.Trim().ToLower();
                    if (!languageMap.TryGetValue(cleanLang, out var langId))
                    {
                        throw new Exception($"Language '{bookSeed.Language}' not found.");
                    }

                    var book = new Book
                    {
                        Title = bookSeed.Title,
                        Subtitle = bookSeed.Subtitle,
                        ISBN10 = bookSeed.ISBN10,
                        ISBN13 = bookSeed.ISBN13,
                        Edition = bookSeed.Edition,
                        PublicationYear = bookSeed.PublicationYear,
                        LanguageId = langId,
                        Summary = bookSeed.Summary,
                        CoverImageUrl = bookSeed.CoverImageUrl,
                        IsDeleted = false
                    };

                    context.Books.Add(book);
                    await context.SaveChangesAsync();

                    if (!string.IsNullOrWhiteSpace(bookSeed.Category))
                    {
                        var cleanCat = bookSeed.Category.Trim().ToLower();
                        if (categoryMap.TryGetValue(cleanCat, out var catId))
                        {
                            context.BookCategories.Add(new BookCategory
                            {
                                BookId = book.Id,
                                CategoryId = catId
                            });
                        }
                    }

                    if (bookSeed.Authors != null)
                    {
                        foreach (var rawAuthorName in bookSeed.Authors)
                        {
                            var cleanName = rawAuthorName.Trim().ToLower();
                            if (authorMap.TryGetValue(cleanName, out var authorId))
                            {
                                context.BookAuthors.Add(new BookAuthor
                                {
                                    BookId = book.Id,
                                    AuthorId = authorId
                                });
                            }
                        }
                    }

                    await context.SaveChangesAsync();
                }

                // 5. Create 3 Book Copies for every Book
                var allBooks = await context.Books.ToListAsync();
                foreach (var book in allBooks)
                {
                    for (int i = 1; i <= 3; i++)
                    {
                        context.BookCopies.Add(new BookCopy
                        {
                            BookId = book.Id,
                            Barcode = $"LIB-{book.Id:0000}-{i:000}",
                            Status = CopyStatus.Available
                        });
                    }
                }

                await context.SaveChangesAsync();
            }

            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private record SeedDataPayload(
        List<LanguageSeedDto>? Languages,
        List<CategorySeedDto>? Categories,
        List<AuthorSeedDto>? Authors,
        List<BookSeedDto>? Books
    );

    private record LanguageSeedDto(string Name);
    private record CategorySeedDto(string Name);
    private record AuthorSeedDto(string FirstName, string LastName, string? Biography);
    private record BookSeedDto(
        string Title,
        string? Subtitle,
        string ISBN10,
        string ISBN13,
        string Edition,
        int PublicationYear,
        string Language,
        string Summary,
        string? CoverImageUrl,
        List<string>? Authors,
        string? Category
    );
}
