using System.Security.Claims;
using LibraryManagement.Services.Borrowing.DTOs;
using LibraryManagement.Services.Borrowing.Enums;
using LibraryManagement.Services.Borrowing.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.Services.Borrowing.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly IBorrowingService _borrowingService;
    private readonly ILogger<LoansController> _logger;

    public LoansController(IBorrowingService borrowingService, ILogger<LoansController> logger)
    {
        _borrowingService = borrowingService;
        _logger = logger;
    }

    [HttpPost]
    [Authorize(Roles = "Member,Librarian,Admin")]
    public async Task<IActionResult> CreateLoanRequest([FromBody] CreateLoanRequestDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var fullName = GetCurrentUserFullName();
        var email = GetCurrentUserEmail();

        try
        {
            var loan = await _borrowingService.CreateLoanRequestAsync(userId.Value, fullName, email, dto);
            return CreatedAtAction(nameof(GetLoanById), new { id = loan.Id }, loan);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("my-loans")]
    [Authorize]
    public async Task<IActionResult> GetMyLoans()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var loans = await _borrowingService.GetUserLoansAsync(userId.Value);
        return Ok(loans);
    }

    [HttpGet]
    [Authorize(Roles = "Librarian,Admin")]
    public async Task<IActionResult> GetAllLoans([FromQuery] LoanStatus? status)
    {
        var loans = await _borrowingService.GetAllLoansAsync(status);
        return Ok(loans);
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetLoanById(int id)
    {
        try
        {
            var loan = await _borrowingService.GetLoanByIdAsync(id);
            var currentUserId = GetCurrentUserId();
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == "Member" && loan.UserId != currentUserId)
            {
                return Forbid();
            }

            return Ok(loan);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id:int}/cancel")]
    [Authorize]
    public async Task<IActionResult> CancelLoan(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        try
        {
            var loan = await _borrowingService.CancelLoanRequestAsync(id, userId.Value);
            return Ok(loan);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Librarian,Admin")]
    public async Task<IActionResult> ApproveLoan(int id, [FromBody] ApproveLoanDto dto)
    {
        var librarianId = GetCurrentUserId() ?? 0;

        try
        {
            var loan = await _borrowingService.ApproveLoanAsync(id, librarianId, dto);
            return Ok(loan);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/reject")]
    [Authorize(Roles = "Librarian,Admin")]
    public async Task<IActionResult> RejectLoan(int id, [FromBody] RejectLoanDto dto)
    {
        var librarianId = GetCurrentUserId() ?? 0;

        try
        {
            var loan = await _borrowingService.RejectLoanAsync(id, librarianId, dto);
            return Ok(loan);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}/return")]
    [Authorize(Roles = "Librarian,Admin")]
    public async Task<IActionResult> ReturnLoan(int id, [FromBody] string? remarks)
    {
        var librarianId = GetCurrentUserId() ?? 0;

        try
        {
            var loan = await _borrowingService.ReturnLoanAsync(id, librarianId, remarks);
            return Ok(loan);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private int? GetCurrentUserId()
    {
        var idClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(idClaim, out var id) ? id : null;
    }

    private string GetCurrentUserFullName()
    {
        var given = User.FindFirst(ClaimTypes.GivenName)?.Value ?? "";
        var surname = User.FindFirst(ClaimTypes.Surname)?.Value ?? "";
        var full = $"{given} {surname}".Trim();
        return string.IsNullOrEmpty(full) ? GetCurrentUserEmail() : full;
    }

    private string GetCurrentUserEmail()
    {
        return User.FindFirst(ClaimTypes.Email)?.Value ??
               User.FindFirst(ClaimTypes.Name)?.Value ??
               "unknown@library.com";
    }
}
