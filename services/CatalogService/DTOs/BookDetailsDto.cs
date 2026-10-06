namespace LibraryManagement.API.DTOs;

public class BookDetailsDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Subtitle { get; set; }

    public string ISBN10 { get; set; } = string.Empty;

    public string ISBN13 { get; set; } = string.Empty;

    public string Edition { get; set; } = string.Empty;

    public int PublicationYear { get; set; }

    public string Language { get; set; } = string.Empty;

    public string Summary { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }

    public List<BookAuthorDto> Authors { get; set; } = [];

    public List<string> Categories { get; set; } = [];

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }

    public int OnLoanCopies { get; set; }

    public int OverdueCopies { get; set; }
}