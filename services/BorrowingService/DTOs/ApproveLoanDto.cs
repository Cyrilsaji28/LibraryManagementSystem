using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Services.Borrowing.DTOs;

public class ApproveLoanDto
{
    public int? BookCopyId { get; set; }

    [MaxLength(500)]
    public string? Remarks { get; set; }
}
