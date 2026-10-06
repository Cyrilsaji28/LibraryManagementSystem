namespace LibraryManagement.API.DTOs.Authors;

public class AuthorBookDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }

    public int PublicationYear { get; set; }
}