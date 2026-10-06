using LibraryManagement.Services.Borrowing.Enums;

namespace LibraryManagement.Services.Borrowing.Entities;

public class Loan
{
    public int Id { get; set; }

    // Member info (captured from JWT claims)
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;

    // Book info
    public int BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public int? BookCopyId { get; set; }

    // Loan periods
    public DateTime RequestedAt { get; set; } = DateTime.UtcNow;
    public int RequestedDays { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }

    // Status and Librarian review
    public LoanStatus Status { get; set; } = LoanStatus.Pending;
    public int? ApprovedByLibrarianId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewRemarks { get; set; }
}
