using LibraryManagement.API.Enums;

namespace LibraryManagement.API.Entities;

public class BookCopy
{
    public int Id { get; set; }

    public string Barcode { get; set; } = string.Empty;

    public CopyStatus Status { get; set; }

    // Foreign Key
    public int BookId { get; set; }

    // Navigation Property
    public Book Book { get; set; } = null!;

}