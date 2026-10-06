import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  RefreshCw,
  AlertTriangle,
  Save,
  Tag,
  Users,
  CheckCircle2,
} from "lucide-react";

import { useBookWithEtag } from "@/feature/catalog/hooks/useBook";
import { useAuthors } from "@/feature/catalog/hooks/useAuthor";
import { useLanguages } from "@/feature/catalog/hooks/useLanguage";
import { useCategories } from "@/feature/catalog/hooks/useCategory";
import { useUpdateBook } from "@/feature/catalog/hooks/useUpdateBook";

export default function EditBookPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();

  // Load Book Details & ETag
  const {
    data: bookWithEtag,
    isLoading: bookLoading,
    isError: bookError,
    refetch,
    isFetching,
  } = useBookWithEtag(bookId);

  // Load Reference Data
  const {
    data: languages = [],
    isLoading: languagesLoading,
  } = useLanguages();

  const {
    data: authors = [],
    isLoading: authorsLoading,
  } = useAuthors();

  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategories();

  const updateBookMutation = useUpdateBook();

  // Form States
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isbn10, setIsbn10] = useState("");
  const [isbn13, setIsbn13] = useState("");
  const [edition, setEdition] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [languageId, setLanguageId] = useState("");
  const [summary, setSummary] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [authorIds, setAuthorIds] = useState<number[]>([]);
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [etag, setEtag] = useState("");
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  // Populate form when book data arrives
  useEffect(() => {
    if (bookWithEtag?.book) {
      const b = bookWithEtag.book;
      setTitle(b.title || "");
      setSubtitle(b.subtitle || "");
      setIsbn10(b.isbN10 || (b as Record<string, unknown>).isbn10 as string || "");
      setIsbn13(b.isbN13 || (b as Record<string, unknown>).isbn13 as string || "");
      setEdition(b.edition || "");
      setPublicationYear(b.publicationYear ? String(b.publicationYear) : "");
      setSummary(b.summary || "");
      setCoverImageUrl(b.coverImageUrl || "");
      setEtag(bookWithEtag.etag);

      // Match language ID by name if needed
      if (languages.length > 0 && b.language) {
        const foundLang = languages.find(
          (l) => l.name.toLowerCase() === b.language.toLowerCase()
        );
        if (foundLang) {
          setLanguageId(String(foundLang.id));
        }
      }

      // Match Authors IDs
      if (b.authors && b.authors.length > 0) {
        setAuthorIds(b.authors.map((a) => a.id));
      }

      // Match Category IDs
      if (categories.length > 0 && b.categories && b.categories.length > 0) {
        const matchedCategoryIds = categories
          .filter((c) => b.categories.includes(c.name))
          .map((c) => c.id);
        setCategoryIds(matchedCategoryIds);
      }

      setHasLoadedInitial(true);
    }
  }, [bookWithEtag, languages, categories]);

  // Handle reload on concurrency conflict
  function handleReloadLatest() {
    refetch().then((res) => {
      if (res.data?.book) {
        const b = res.data.book;
        setTitle(b.title || "");
        setSubtitle(b.subtitle || "");
        setIsbn10(b.isbN10 || (b as Record<string, unknown>).isbn10 as string || "");
        setIsbn13(b.isbN13 || (b as Record<string, unknown>).isbn13 as string || "");
        setEdition(b.edition || "");
        setPublicationYear(b.publicationYear ? String(b.publicationYear) : "");
        setSummary(b.summary || "");
        setCoverImageUrl(b.coverImageUrl || "");
        setEtag(res.data.etag);

        if (languages.length > 0 && b.language) {
          const foundLang = languages.find(
            (l) => l.name.toLowerCase() === b.language.toLowerCase()
          );
          if (foundLang) setLanguageId(String(foundLang.id));
        }

        if (b.authors && b.authors.length > 0) {
          setAuthorIds(b.authors.map((a) => a.id));
        }

        if (categories.length > 0 && b.categories && b.categories.length > 0) {
          const matched = categories
            .filter((c) => b.categories.includes(c.name))
            .map((c) => c.id);
          setCategoryIds(matched);
        }
        updateBookMutation.reset();
      }
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!etag) {
      alert("Missing ETag concurrency token. Please reload the book.");
      return;
    }

    updateBookMutation.mutate(
      {
        id: bookId,
        request: {
          title: title.trim(),
          subtitle: subtitle.trim() || undefined,
          isbn10: isbn10.trim() || undefined,
          isbn13: isbn13.trim(),
          edition: edition.trim() || undefined,
          publicationYear: Number(publicationYear),
          languageId: Number(languageId),
          summary: summary.trim() || undefined,
          coverImageUrl: coverImageUrl.trim() || undefined,
          authorIds,
          categoryIds,
        },
        etag,
      },
      {
        onSuccess: () => {
          navigate(`/catalog/${bookId}`);
        },
      }
    );
  }

  /* ── Loading State ── */
  if (bookLoading && !hasLoadedInitial) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  /* ── Error / Not Found ── */
  if (bookError || !bookWithEtag) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950">
          <BookOpen className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Book not found
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          The book you are trying to edit could not be loaded.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>
      </div>
    );
  }

  // Parse mutation error details
  const mutationErr = updateBookMutation.error as unknown as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
    message?: string;
  };

  const is412Conflict = mutationErr?.response?.status === 412;
  const is428Precondition = mutationErr?.response?.status === 428;

  const errorData = mutationErr?.response?.data;
  const validationErrors: string[] = [];

  if (errorData?.errors && typeof errorData.errors === "object") {
    Object.values(errorData.errors).forEach((messages) => {
      if (Array.isArray(messages)) {
        validationErrors.push(...messages);
      }
    });
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-400";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Previous Page
          </button>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Edit Book
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Update book information with optimistic concurrency control.
          </p>
        </div>

        {/* ETag badge */}
        {etag && (
          <div className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 text-xs font-mono font-medium text-indigo-700 dark:text-indigo-300">
            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
            ETag: {etag.slice(0, 10)}...
          </div>
        )}
      </div>

      {/* ── Concurrency Conflict Alert (HTTP 412) ── */}
      <AnimatePresence>
        {is412Conflict && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/80 p-5 text-amber-900 dark:text-amber-200 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold">
                  Concurrency Conflict (412 Precondition Failed)
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
                  This book was modified by another user since you opened it. To
                  prevent overwriting recent changes, please reload the latest
                  data and review your changes before saving.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReloadLatest}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                    />
                    Reload Latest Version
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Precondition Required Alert (HTTP 428) ── */}
      <AnimatePresence>
        {is428Precondition && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-4 text-rose-800 dark:text-rose-200"
          >
            <p className="font-semibold">
              If-Match ETag header is missing. Please reload the book and try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── General Validation Errors ── */}
      {updateBookMutation.isError && !is412Conflict && !is428Precondition && (
        <div className="mb-6 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/70 p-5 text-red-700 dark:text-red-300">
          <p className="font-bold">
            {errorData?.message ||
              mutationErr?.message ||
              "Failed to update the book. Please verify the entered details."}
          </p>
          {validationErrors.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm space-y-1">
              {validationErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Main Form ── */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm"
      >
        {/* ── Section: Basic Information ── */}
        <section>
          <div className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2>Basic Information</h2>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={inputClass}
                placeholder="Enter book title"
              />
            </div>

            {/* Subtitle */}
            <div className="md:col-span-2">
              <label
                htmlFor="subtitle"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Subtitle
              </label>
              <input
                id="subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={inputClass}
                placeholder="Enter subtitle (optional)"
              />
            </div>

            {/* ISBN-10 */}
            <div>
              <label
                htmlFor="isbn10"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                ISBN-10
              </label>
              <input
                id="isbn10"
                type="text"
                value={isbn10}
                onChange={(e) => setIsbn10(e.target.value)}
                className={inputClass}
                placeholder="ISBN-10"
              />
            </div>

            {/* ISBN-13 */}
            <div>
              <label
                htmlFor="isbn13"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                ISBN-13 *
              </label>
              <input
                id="isbn13"
                type="text"
                value={isbn13}
                onChange={(e) => setIsbn13(e.target.value)}
                required
                className={inputClass}
                placeholder="ISBN-13 (13 digits)"
              />
            </div>

            {/* Edition */}
            <div>
              <label
                htmlFor="edition"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Edition
              </label>
              <input
                id="edition"
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                className={inputClass}
                placeholder="e.g. 2nd Edition"
              />
            </div>

            {/* Publication Year */}
            <div>
              <label
                htmlFor="publicationYear"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Publication Year *
              </label>
              <input
                id="publicationYear"
                type="number"
                value={publicationYear}
                onChange={(e) => setPublicationYear(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. 2024"
              />
            </div>
          </div>
        </section>

        {/* ── Section: Language ── */}
        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <label
            htmlFor="language"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Language *
          </label>
          <select
            id="language"
            value={languageId}
            onChange={(e) => setLanguageId(e.target.value)}
            required
            disabled={languagesLoading}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">
              {languagesLoading ? "Loading languages..." : "Select Language"}
            </option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </section>

        {/* ── Section: Authors & Categories ── */}
        <section className="border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Authors */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Users className="h-4 w-4 text-indigo-600" />
                <label htmlFor="authors">Authors *</label>
              </div>
              <select
                id="authors"
                multiple
                value={authorIds.map(String)}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => Number(opt.value)
                  );
                  setAuthorIds(selected);
                }}
                required
                disabled={authorsLoading}
                className="mt-2 min-h-40 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.fullName}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple authors.
              </p>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <Tag className="h-4 w-4 text-indigo-600" />
                <label htmlFor="categories">Categories *</label>
              </div>
              <select
                id="categories"
                multiple
                value={categoryIds.map(String)}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (opt) => Number(opt.value)
                  );
                  setCategoryIds(selected);
                }}
                required
                disabled={categoriesLoading}
                className="mt-2 min-h-40 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-slate-400">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section: Description & Cover ── */}
        <section className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-5">
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Summary / Description
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="Enter book summary or synopsis"
            />
          </div>

          <div>
            <label
              htmlFor="coverImageUrl"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Cover Image URL
            </label>
            <input
              id="coverImageUrl"
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/cover.jpg"
            />
          </div>
        </section>

        {/* ── Form Actions ── */}
        <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-slate-800 pt-6 sm:flex-row sm:justify-end">
          <Link
            to={`/catalog/${bookId}`}
            className="rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-3 text-center text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              updateBookMutation.isPending ||
              authorIds.length === 0 ||
              categoryIds.length === 0 ||
              !languageId
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateBookMutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
