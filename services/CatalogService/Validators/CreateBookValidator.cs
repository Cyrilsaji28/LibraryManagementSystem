using FluentValidation;
using LibraryManagement.API.DTOs;

namespace LibraryManagement.API.Validators;

public class CreateBookRequestValidator : AbstractValidator<CreateBookRequest>
{
    public CreateBookRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.ISBN13)
            .NotEmpty()
            .Length(13);

        RuleFor(x => x.PublicationYear)
            .InclusiveBetween(1000, DateTime.UtcNow.Year);

        RuleFor(x => x.LanguageId)
            .GreaterThan(0);

        RuleFor(x => x.AuthorIds)
            .NotEmpty()
            .WithMessage("At least one author is required.");

        RuleFor(x => x.CategoryIds)
            .NotEmpty()
            .WithMessage("At least one category is required.");

        RuleFor(x => x.TotalCopies)
            .GreaterThan(0);

        RuleFor(x => x.CoverImageUrl)
            .Must(url =>
                string.IsNullOrWhiteSpace(url) ||
                Uri.IsWellFormedUriString(url, UriKind.Absolute))
            .WithMessage("Cover image URL must be a valid URL.");
    }
}