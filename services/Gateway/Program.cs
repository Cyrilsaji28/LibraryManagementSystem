using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs/gateway-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
builder.Host.UseSerilog();

// Port 5281 (matching frontend apiClient baseURL)
builder.WebHost.UseUrls("http://0.0.0.0:5281");

// CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithExposedHeaders("ETag");
    });
});

// Configure YARP
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.UseSerilogRequestLogging();
app.UseCors("FrontendCors");

// Root status endpoint
app.MapGet("/", () => Results.Ok(new
{
    Service = "Library Management API Gateway",
    Status = "Healthy",
    Version = "1.0",
    Routes = new[]
    {
        new { Route = "/api/auth/*", Destination = "Auth Service (http://localhost:5001)" },
        new { Route = "/api/books/*", Destination = "Catalog Service (http://localhost:5002)" },
        new { Route = "/api/authors/*", Destination = "Catalog Service (http://localhost:5002)" },
        new { Route = "/api/categories/*", Destination = "Catalog Service (http://localhost:5002)" },
        new { Route = "/api/languages/*", Destination = "Catalog Service (http://localhost:5002)" },
        new { Route = "/api/loans/*", Destination = "Borrowing Service (http://localhost:5003)" }
    }
}));

app.MapReverseProxy();

try
{
    Log.Information("Starting API Gateway on http://localhost:5281...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "API Gateway terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
