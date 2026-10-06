using FluentValidation;
using FluentValidation.AspNetCore;
using LibraryManagement.API.Data;
using LibraryManagement.API.Repositories.Implementations;
using LibraryManagement.API.Repositories.Interfaces;
using LibraryManagement.API.Services.Implementations;
using LibraryManagement.API.Services.Interfaces;
using LibraryManagement.API.Validators;
using LibraryManagement.Shared.Extensions;
using Microsoft.EntityFrameworkCore;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/catalog-service-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Port 5002
builder.WebHost.UseUrls("http://0.0.0.0:5002");

builder.Services.AddControllers();

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<CreateBookRequestValidator>();
builder.Services.AddFluentValidationAutoValidation()
    .AddFluentValidationClientsideAdapters();

// Database
builder.Services.AddDbContext<CatalogDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(w =>
        w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

// Repositories
builder.Services.AddScoped<IBookRepository, BookRepository>();
builder.Services.AddScoped<IAuthorRepository, AuthorRepository>();
builder.Services.AddScoped<ILookupRepository, LookupRepository>();

// Services
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthorService, AuthorService>();

// Shared Extensions
builder.Services.AddSharedJwtAuthentication(builder.Configuration);
builder.Services.AddSharedSwagger("Library Management - Catalog Service");

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("ETag");
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

// Seed data
await CatalogDbSeeder.SeedAsync(app);

try
{
    Log.Information("Starting Catalog Service on http://localhost:5002...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Catalog Service terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
