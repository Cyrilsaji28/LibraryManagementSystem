namespace LibraryManagement.API.DTOs;

public class BookSearchRequest
{
    public string? Q { get; set; }

    public string? ISBN { get; set; }

    public string? Author { get; set; }

    public string? Category { get; set; }

    public string? Language { get; set; }

    public bool? AvailableOnly { get; set; }

    public int Page { get; set; } = 1;

    public int Size { get; set; } = 10;

    public string SortBy { get; set; } = "title";

    public bool Descending { get; set; } = false;
}