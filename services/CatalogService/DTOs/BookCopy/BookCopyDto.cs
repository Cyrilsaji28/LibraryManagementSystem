using LibraryManagement.API.Enums;

namespace LibraryManagement.API.DTOs;

public class BookCopyDto
{
    public int Id { get; set; }

    public string Barcode { get; set; } = string.Empty;

    public CopyStatus Status { get; set; }

    public string StatusName => Status.ToString();

    public int BookId { get; set; }
}

public class AddBookCopyRequest
{
    public string? CustomBarcode { get; set; }

    public int Count { get; set; } = 1;

    public CopyStatus Status { get; set; } = CopyStatus.Available;
}

public class UpdateBookCopyStatusRequest
{
    public CopyStatus Status { get; set; }
}
