using LibraryManagement.API.Entities;

namespace LibraryManagement.API.Repositories.Interfaces;

public interface ILookupRepository
{
    Task<IEnumerable<Category>> GetCategoriesAsync();
    Task<IEnumerable<Language>> GetLanguagesAsync();
}
