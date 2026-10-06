namespace LibraryManagement.API.DTOs;

public class AuthorDto
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string? Biography { get; set; }

    public int BookCount { get; set; }
}