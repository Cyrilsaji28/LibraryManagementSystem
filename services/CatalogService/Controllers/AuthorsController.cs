using LibraryManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly IAuthorService _authorService;

    public AuthorsController(IAuthorService authorService)
    {
        _authorService = authorService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAuthors([FromQuery] string? search)
    {
        var authors = await _authorService.GetAuthorsAsync(search);

        return Ok(authors);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetAuthor(int id)
    {
        var author = await _authorService.GetAuthorByIdAsync(id);

        if (author == null)
            return NotFound();

        return Ok(author);
    }

    [HttpGet("{id:int}/books")]
    public async Task<IActionResult> GetBooksByAuthor(int id)
    {
        var books = await _authorService.GetBooksByAuthorAsync(id);

        return Ok(books);
    }
}