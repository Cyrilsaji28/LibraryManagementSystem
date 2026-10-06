namespace LibraryManagement.Services.Borrowing.DTOs;

public class LoanResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;

    public int BookId { get; set; }
    public string BookTitle { get; set; } = string.Empty;
    public int? BookCopyId { get; set; }

    public DateTime RequestedAt { get; set; }
    public int RequestedDays { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? ReturnedAt { get; set; }

    public string Status { get; set; } = string.Empty;
    public int? ApprovedByLibrarianId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? ReviewRemarks { get; set; }

    public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && ReturnedAt == null && Status == "Approved";
}
