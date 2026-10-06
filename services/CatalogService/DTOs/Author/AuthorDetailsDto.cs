namespace LibraryManagement.API.DTOs;

public class AuthorDetailsDto
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? Biography { get; set; }

    public List<BookSummaryDto> Books { get; set; } = [];
}