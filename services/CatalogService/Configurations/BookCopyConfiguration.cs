using LibraryManagement.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryManagement.API.Configurations;

public class BookCopyConfiguration : IEntityTypeConfiguration<BookCopy>
{
    public void Configure(EntityTypeBuilder<BookCopy> builder)
    {
        builder.ToTable("BookCopies");
        
        builder.HasKey(bc => bc.Id);

        builder.Property(bc => bc.Barcode)
               .HasMaxLength(100)
               .IsRequired();

        builder.HasIndex(bc => bc.Barcode)
               .IsUnique();

        builder.Property(bc => bc.Status)
               .IsRequired();

        builder.HasOne(bc => bc.Book)
               .WithMany(b => b.BookCopies)
               .HasForeignKey(bc => bc.BookId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(bc => !bc.Book.IsDeleted);
    }
}