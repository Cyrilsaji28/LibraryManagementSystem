using LibraryManagement.API.Data;
using LibraryManagement.API.Entities;
using LibraryManagement.API.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagement.API.Repositories.Implementations;

public class LookupRepository : ILookupRepository
{
    private readonly CatalogDbContext _context;

    public LookupRepository(CatalogDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetCategoriesAsync()
    {
        return await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Language>> GetLanguagesAsync()
    {
        return await _context.Languages
            .OrderBy(l => l.Name)
            .ToListAsync();
    }
}
