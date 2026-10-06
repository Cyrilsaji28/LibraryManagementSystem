using LibraryManagement.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ILookupRepository _lookupRepository;

    public CategoriesController(ILookupRepository lookupRepository)
    {
        _lookupRepository = lookupRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _lookupRepository.GetCategoriesAsync();

        var result = categories.Select(c => new
        {
            id = c.Id,
            name = c.Name
        });

        return Ok(result);
    }
}