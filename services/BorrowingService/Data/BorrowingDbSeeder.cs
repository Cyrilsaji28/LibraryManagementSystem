using LibraryManagement.Services.Borrowing.Data;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Services.Borrowing.Data;

public static class BorrowingDbSeeder
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<BorrowingDbContext>();

        await context.Database.MigrateAsync();
    }
}
