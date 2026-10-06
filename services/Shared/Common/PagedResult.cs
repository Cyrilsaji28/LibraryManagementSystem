namespace LibraryManagement.Shared.Common;

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = [];

    public int Page { get; set; }

    public int Size { get; set; }

    public int TotalItems { get; set; }

    public int TotalPages { get; set; }
}
