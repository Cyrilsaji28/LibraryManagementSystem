using LibraryManagement.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryManagement.API.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("Books");

        builder.HasKey(b => b.Id);

        builder.Property(b => b.Title)
               .HasMaxLength(200)
               .IsRequired();

        builder.Property(b => b.Subtitle)
               .HasMaxLength(200);

        builder.Property(b => b.ISBN10)
               .HasMaxLength(10);

        builder.Property(b => b.ISBN13)
               .HasMaxLength(13);

        builder.HasIndex(b => b.ISBN13)
               .IsUnique();

        builder.Property(b => b.Edition)
               .HasMaxLength(50);

        builder.Property(b => b.Summary)
               .HasMaxLength(5000);

        builder.Property(b => b.CoverImageUrl)
               .HasMaxLength(500);

        builder.HasOne(b => b.Language)
               .WithMany(l => l.Books)
               .HasForeignKey(b => b.LanguageId)
               .OnDelete(DeleteBehavior.Restrict);
               
        builder.Property(b => b.Version)
               .IsRowVersion();

        builder.Property(b => b.IsDeleted)
               .HasDefaultValue(false);

        builder.HasQueryFilter(b => !b.IsDeleted);
    }
}