namespace LibraryManagement.API.Entities;

public class Book
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Subtitle { get; set; }

    public string ISBN10 { get; set; } = string.Empty;

    public string ISBN13 { get; set; } = string.Empty;

    public string Edition { get; set; } = string.Empty;

    public int PublicationYear { get; set; }

    public int LanguageId { get; set; }

    public Language Language { get; set; } = null!;

    public string Summary { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }
    public uint Version { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public ICollection<BookCopy> BookCopies { get; set; } = new List<BookCopy>();
    public ICollection<BookAuthor> BookAuthors { get; set; } = new List<BookAuthor>();
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
}