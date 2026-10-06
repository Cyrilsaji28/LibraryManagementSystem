namespace LibraryManagement.API.Entities;

public class Language
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    // Navigation Property
   public ICollection<Book> Books { get; set; } = new List<Book>();
}