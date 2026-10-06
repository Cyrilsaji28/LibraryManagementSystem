using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Services.Borrowing.DTOs;

public class RejectLoanDto
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}
