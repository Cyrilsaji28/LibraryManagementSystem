using LibraryManagement.API.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibraryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LanguagesController : ControllerBase
{
    private readonly ILookupRepository _lookupRepository;

    public LanguagesController(ILookupRepository lookupRepository)
    {
        _lookupRepository = lookupRepository;
    }

    [HttpGet]
    public async Task<IActionResult> GetLanguages()
    {
        var languages = await _lookupRepository.GetLanguagesAsync();

        var result = languages.Select(l => new
        {
            id = l.Id,
            name = l.Name
        });

        return Ok(result);
    }
}