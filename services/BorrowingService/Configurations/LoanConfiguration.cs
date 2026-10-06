using LibraryManagement.Services.Borrowing.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryManagement.Services.Borrowing.Configurations;

public class LoanConfiguration : IEntityTypeConfiguration<Loan>
{
    public void Configure(EntityTypeBuilder<Loan> builder)
    {
        builder.ToTable("Loans");

        builder.HasKey(l => l.Id);

        builder.Property(l => l.UserId)
            .IsRequired();

        builder.Property(l => l.UserFullName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(l => l.UserEmail)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(l => l.BookId)
            .IsRequired();

        builder.Property(l => l.BookTitle)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(l => l.RequestedDays)
            .IsRequired();

        builder.Property(l => l.RequestedAt)
            .IsRequired();

        builder.Property(l => l.Status)
            .IsRequired();

        builder.Property(l => l.ReviewRemarks)
            .HasMaxLength(500);

        builder.HasIndex(l => l.UserId);
        builder.HasIndex(l => l.BookId);
        builder.HasIndex(l => l.Status);
    }
}
