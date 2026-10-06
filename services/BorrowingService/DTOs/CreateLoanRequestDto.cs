using System.ComponentModel.DataAnnotations;

namespace LibraryManagement.Services.Borrowing.DTOs;

public class CreateLoanRequestDto
{
    [Required]
    public int BookId { get; set; }

    [Required]
    [MaxLength(255)]
    public string BookTitle { get; set; } = string.Empty;

    [Range(1, 60, ErrorMessage = "Requested days must be between 1 and 60 days.")]
    public int RequestedDays { get; set; } = 14;
}
