import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useAuthors } from "@/feature/catalog/hooks/useAuthor";
import { useLanguages } from "@/feature/catalog/hooks/useLanguage";
import { useCategories } from "@/feature/catalog/hooks/useCategory";
import { useCreateBook } from "@/feature/catalog/hooks/useCreateBook";
import MultiSelectDropdown from "@/feature/catalog/components/MultiSelectDropdown";

export default function AddBookPage() {
  // ==============================
  // Load Languages
  // ==============================

  const {
    data: languages = [],
    isLoading: languagesLoading,
    error: languagesError,
  } = useLanguages();

  // ==============================
  // Load Authors
  // ==============================

  const {
    data: authors = [],
    isLoading: authorsLoading,
    error: authorsError,
  } = useAuthors();

  // ==============================
  // Load Categories
  // ==============================

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const navigate = useNavigate();

  const createBookMutation = useCreateBook();

  // ==============================
  // Form State
  // ==============================

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isbn10, setIsbn10] = useState("");
  const [isbn13, setIsbn13] = useState("");
  const [edition, setEdition] = useState("");
  const [publicationYear, setPublicationYear] = useState("");

  const [languageId, setLanguageId] = useState("");

  const [summary, setSummary] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Selected author IDs
  const [authorIds, setAuthorIds] = useState<number[]>([]);

  // Selected category IDs
  const [categoryIds, setCategoryIds] = useState<number[]>([]);

  // Number of physical copies
  const [totalCopies, setTotalCopies] = useState("1");

  // ==============================
  // Submit Handler
  // ==============================

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    createBookMutation.mutate(
      {
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        isbn10: isbn10.trim(),
        isbn13: isbn13.trim(),
        edition: edition.trim(),
        publicationYear: Number(publicationYear),

        languageId: Number(languageId),

        summary: summary.trim(),
        coverImageUrl: coverImageUrl.trim(),

        // Already number[]
        authorIds,

        // Already number[]
        categoryIds,

        totalCopies: Number(totalCopies),
      },
      {
        onSuccess: () => {
          navigate("/catalog");
        },
      }
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">

      {/* ==============================
          Header
      ============================== */}

      <div className="mb-8">

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>

        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
          Add New Book
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Add a new book to the library catalog.
        </p>

      </div>

      {/* ==============================
          Form
      ============================== */}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >

        {/* ==============================
            Basic Information
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Basic Information
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* Title */}

            <div className="md:col-span-2">

              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Title *
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="Enter book title"
              />

            </div>

            {/* Subtitle */}

            <div className="md:col-span-2">

              <label
                htmlFor="subtitle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Subtitle
              </label>

              <input
                id="subtitle"
                type="text"
                value={subtitle}
                onChange={(e) =>
                  setSubtitle(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="Enter subtitle"
              />

            </div>

            {/* ISBN 10 */}

            <div>

              <label
                htmlFor="isbn10"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ISBN-10
              </label>

              <input
                id="isbn10"
                type="text"
                value={isbn10}
                onChange={(e) =>
                  setIsbn10(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="ISBN-10"
              />

            </div>

            {/* ISBN 13 */}

            <div>

              <label
                htmlFor="isbn13"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                ISBN-13 *
              </label>

              <input
                id="isbn13"
                type="text"
                value={isbn13}
                onChange={(e) =>
                  setIsbn13(e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="ISBN-13"
              />

            </div>

            {/* Edition */}

            <div>

              <label
                htmlFor="edition"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Edition
              </label>

              <input
                id="edition"
                type="text"
                value={edition}
                onChange={(e) =>
                  setEdition(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="1st Edition"
              />

            </div>

            {/* Publication Year */}

            <div>

              <label
                htmlFor="publicationYear"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Publication Year *
              </label>

              <input
                id="publicationYear"
                type="number"
                value={publicationYear}
                onChange={(e) =>
                  setPublicationYear(e.target.value)
                }
                required
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                placeholder="2026"
              />

            </div>

          </div>

        </section>

        {/* ==============================
            Language
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Language
          </h2>

          <div className="mt-5">

            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Language *
            </label>

            <select
              id="language"
              value={languageId}
              onChange={(e) =>
                setLanguageId(e.target.value)
              }
              required
              disabled={
                languagesLoading ||
                !!languagesError
              }
              className="mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            >

              <option value="">
                {languagesLoading
                  ? "Loading languages..."
                  : "Select Language"}
              </option>

              {languages.map((language) => (
                <option
                  key={language.id}
                  value={language.id}
                >
                  {language.name}
                </option>
              ))}

            </select>

            {languagesError && (
              <p className="mt-2 text-sm text-red-600">
                Failed to load languages.
              </p>
            )}

            <p className="mt-2 text-sm text-gray-500">
              Select an existing language from the database.
            </p>

          </div>

        </section>

        {/* ==============================
            Authors and Categories
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Authors & Categories
          </h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">

            {/* ==============================
                Authors
            ============================== */}

            <MultiSelectDropdown
              label="Authors"
              required
              options={authors.map((author) => ({
                id: author.id,
                label: author.fullName,
              }))}
              selectedIds={authorIds}
              onChange={setAuthorIds}
              placeholder="Select authors..."
              loading={authorsLoading}
              error={!!authorsError}
              errorMessage="Failed to load authors."
              helperText="Select one or more authors from the list."
            />

            {/* ==============================
                Categories
            ============================== */}

            <MultiSelectDropdown
              label="Categories"
              required
              options={categories.map((category) => ({
                id: category.id,
                label: category.name,
              }))}
              selectedIds={categoryIds}
              onChange={setCategoryIds}
              placeholder="Select categories..."
              loading={categoriesLoading}
              error={!!categoriesError}
              errorMessage="Failed to load categories."
              helperText="Select one or more categories from the list."
            />
          </div>

        </section>

        {/* ==============================
            Description
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Description
          </h2>

          <div className="mt-5">

            <label
              htmlFor="summary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Summary
            </label>

            <textarea
              id="summary"
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value)
              }
              rows={5}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="Enter book summary"
            />

          </div>

        </section>

        {/* ==============================
            Cover
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Cover Image
          </h2>

          <div className="mt-5">

            <label
              htmlFor="coverImageUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Cover Image URL *
            </label>

            <input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) =>
                setCoverImageUrl(e.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="https://example.com/book-cover.jpg"
            />

          </div>

        </section>

        {/* ==============================
            Inventory
        ============================== */}

        <section>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Inventory
          </h2>

          <div className="mt-5">

            <label
              htmlFor="totalCopies"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Total Copies *
            </label>

            <input
              id="totalCopies"
              type="number"
              min="1"
              value={totalCopies}
              onChange={(e) =>
                setTotalCopies(e.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
              placeholder="5"
            />

            <p className="mt-2 text-sm text-gray-500">
              The backend will automatically create a
              unique barcode for every physical copy.
            </p>

          </div>

        </section>

        {/* ==============================
            Error
        ============================== */}

        {createBookMutation.isError && (() => {
          const err = createBookMutation.error as unknown as {
            response?: {
              data?: {
                message?: string;
                errors?: Record<string, string[]>;
              };
            };
            message?: string;
          };

          const errorData = err?.response?.data;
          const validationErrors: string[] = [];

          if (errorData?.errors && typeof errorData.errors === "object") {
            Object.values(errorData.errors).forEach((messages) => {
              if (Array.isArray(messages)) {
                validationErrors.push(...messages);
              }
            });
          }

          const singleMessage =
            errorData?.message ||
            (validationErrors.length === 0 ? err?.message : undefined) ||
            "Failed to create the book. Please check your information and try again.";

          return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <p className="font-semibold">{singleMessage}</p>
              {validationErrors.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm space-y-1">
                  {validationErrors.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })()}

        {/* ==============================
            Buttons
        ============================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end dark:border-gray-700">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              createBookMutation.isPending ||
              languagesLoading ||
              !!languagesError ||
              authorsLoading ||
              !!authorsError ||
              categoriesLoading ||
              !!categoriesError ||
              authorIds.length === 0 ||
              categoryIds.length === 0
            }
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {createBookMutation.isPending
              ? "Creating Book..."
              : "Add Book"}

          </button>

        </div>

      </form>
    </div>
  );
}