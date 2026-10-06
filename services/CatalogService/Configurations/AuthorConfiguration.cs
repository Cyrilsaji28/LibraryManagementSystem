using LibraryManagement.API.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryManagement.API.Configurations;

public class AuthorConfiguration : IEntityTypeConfiguration<Author>
{
    public void Configure(EntityTypeBuilder<Author> builder)
    {
         builder.ToTable("Authors");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.FirstName)
               .HasMaxLength(200)
               .IsRequired();

        builder.Property(a => a.LastName)
               .HasMaxLength(200);

        builder.Property(a => a.Biography)
               .HasMaxLength(2000);   
               
    }
}