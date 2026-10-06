using LibraryManagement.Services.Borrowing.Data;
using LibraryManagement.Services.Borrowing.Repositories;
using LibraryManagement.Services.Borrowing.Services;
using LibraryManagement.Shared.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/borrowing-service-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Port 5003
//builder.WebHost.UseUrls("http://localhost:5003");
builder.WebHost.UseUrls("http://0.0.0.0:5003");

builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<BorrowingDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(w =>
        w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

// Repositories & Services
builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<IBorrowingService, BorrowingService>();

// Shared Extensions
builder.Services.AddSharedJwtAuthentication(builder.Configuration);
builder.Services.AddSharedSwagger("Library Management - Borrowing Service");

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply migrations
await BorrowingDbSeeder.SeedAsync(app);

try
{
    Log.Information("Starting Borrowing Service on http://localhost:5003...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Borrowing Service terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
