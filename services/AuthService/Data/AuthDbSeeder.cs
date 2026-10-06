using LibraryManagement.Services.Auth.Entities;
using LibraryManagement.Services.Auth.Enums;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.Services.Auth.Data;

public static class AuthDbSeeder
{
    public static async Task SeedAsync(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AuthDbContext>();

        await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
            return;

        var defaultUsers = new List<User>
        {
            new()
            {
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                FirstName = "Librarian",
                LastName = "Staff",
                Email = "librarian@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Librarian@123"),
                Role = UserRole.Librarian,
                CreatedAt = DateTime.UtcNow
            },
            new()
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "member@library.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Member@123"),
                Role = UserRole.Member,
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Users.AddRangeAsync(defaultUsers);
        await context.SaveChangesAsync();
    }
}
