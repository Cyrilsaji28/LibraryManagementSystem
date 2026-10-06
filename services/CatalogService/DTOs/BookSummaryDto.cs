namespace LibraryManagement.API.DTOs;

public class BookSummaryDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Subtitle { get; set; }

    public string ISBN13 { get; set; } = string.Empty;

    public int PublicationYear { get; set; }

    public string Language { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }

    public int TotalCopies { get; set; }

    public int AvailableCopies { get; set; }
}