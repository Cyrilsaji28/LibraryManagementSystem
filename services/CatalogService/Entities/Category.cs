namespace LibraryManagement.API.Entities;

public class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    // Navigation Property
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
}