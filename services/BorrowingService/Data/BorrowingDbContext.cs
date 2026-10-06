using LibraryManagement.Services.Borrowing.Entities;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Services.Borrowing.Data;

public class BorrowingDbContext : DbContext
{
    public BorrowingDbContext(DbContextOptions<BorrowingDbContext> options) : base(options)
    {
    }

    public DbSet<Loan> Loans => Set<Loan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("borrowing");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(BorrowingDbContext).Assembly);
    }
}
