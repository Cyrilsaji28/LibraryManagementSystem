using LibraryManagement.API.DTOs;
using LibraryManagement.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly ILogger<BooksController> _logger;


    public BooksController(IBookService bookService, ILogger<BooksController> logger)
    {
        _bookService = bookService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetBooks([FromQuery] BookSearchRequest request)
    {
        _logger.LogInformation("Getting books with request: {Request}", request);
        var books = await _bookService.GetBooksAsync(request);

        return Ok(books);
    }

    [Authorize]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBookById(int id)
    {
        var book = await _bookService.GetBookByIdAsync(id);

        if (book is null)
            return NotFound();

        var rowVersion = await _bookService
            .GetBookRowVersionAsync(id);

        if (rowVersion is null)
            return NotFound();

        var etag = Convert.ToBase64String(rowVersion);

        Response.Headers.ETag = $"\"{etag}\"";

        return Ok(book);
    }



    [HttpPost]
    [Authorize(Roles = "Librarian,Admin")]
    public async Task<IActionResult> CreateBook(
        [FromBody] CreateBookRequest request)
    {
        var bookId = await _bookService.CreateBookAsync(request);

        return CreatedAtAction(
            nameof(GetBookById),
            new { id = bookId },
            new
            {
                id = bookId,
                message = "Book created successfully."
            });
    }


    [Authorize(Roles = "Librarian,Admin")]
    [HttpPatch("{id:int}")]
    public async Task<IActionResult> UpdateBook(
        int id,
        [FromBody] UpdateBookRequest request)
    {
        if (!Request.Headers.TryGetValue(
                "If-Match",
                out var ifMatch))
        {
            return StatusCode(
                StatusCodes.Status428PreconditionRequired,
                new
                {

                    message = "If-Match header is required."
                });
        }

        var etag = ifMatch.ToString().Trim('"');

        byte[] rowVersion;

        try
        {
            rowVersion = Convert.FromBase64String(etag);
        }
        catch (FormatException)
        {
            return BadRequest(new
            {
                message = "Invalid ETag."
            });
        }

        try
        {
            var updated = await _bookService.UpdateBookAsync(
                id,
                request,
                rowVersion);

            if (!updated)
            {
                return StatusCode(
                    StatusCodes.Status412PreconditionFailed,
                    new
                    {
                        message =
                            "The book was modified by another user. " +
                            "Please reload the book and try again."
                    });
            }

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }

    [Authorize(Roles = "Librarian,Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var deleted = await _bookService.DeleteBookAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Book not found."
            });
        }

        return NoContent();
    }

    [Authorize(Roles = "Librarian,Admin")]
    [HttpGet("{id:int}/copies")]
    public async Task<IActionResult> GetBookCopies(int id)
    {
        var copies = await _bookService.GetBookCopiesAsync(id);
        return Ok(copies);
    }

    [Authorize(Roles = "Librarian,Admin")]
    [HttpPost("{id:int}/copies")]
    public async Task<IActionResult> AddBookCopies(int id, [FromBody] AddBookCopyRequest request)
    {
        try
        {
            var copies = await _bookService.AddBookCopiesAsync(id, request);
            return Ok(copies);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize(Roles = "Librarian,Admin")]
    [HttpPatch("{id:int}/copies/{copyId:int}/status")]
    public async Task<IActionResult> UpdateBookCopyStatus(
        int id,
        int copyId,
        [FromBody] UpdateBookCopyStatusRequest request)
    {
        var updated = await _bookService.UpdateBookCopyStatusAsync(id, copyId, request.Status);
        if (!updated)
        {
            return NotFound(new { message = "Book copy not found." });
        }

        return NoContent();
    }

    [Authorize(Roles = "Librarian,Admin")]
    [HttpDelete("{id:int}/copies/{copyId:int}")]
    public async Task<IActionResult> DeleteBookCopy(int id, int copyId)
    {
        var deleted = await _bookService.DeleteBookCopyAsync(id, copyId);
        if (!deleted)
        {
            return NotFound(new { message = "Book copy not found." });
        }

        return NoContent();
    }
}

