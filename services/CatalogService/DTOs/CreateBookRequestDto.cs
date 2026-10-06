public class CreateBookRequest
{
    public string Title { get; set; } = string.Empty;

    public string? Subtitle { get; set; }

    public string? ISBN10 { get; set; }

    public string ISBN13 { get; set; } = string.Empty;

    public string? Edition { get; set; }

    public int PublicationYear { get; set; }

    public int LanguageId { get; set; }

    public string? Summary { get; set; }

    public string? CoverImageUrl { get; set; }

    public List<int> AuthorIds { get; set; } = [];

    public List<int> CategoryIds { get; set; } = [];

    public int TotalCopies { get; set; }
}