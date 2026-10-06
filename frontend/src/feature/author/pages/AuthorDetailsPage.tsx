import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuthor } from "../hooks/useAuthor";

export default function AuthorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const authorId = Number(id);

  const {
    data: author,
    isLoading,
    isError,
  } = useAuthor(authorId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-64 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="h-32 rounded bg-slate-200 dark:bg-slate-700" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-700"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !author) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-bold">
          Author not found
        </h1>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Previous Page
      </button>

      {/* Author Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Avatar */}
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-blue-600 text-5xl font-bold text-white">
            {author.firstName.charAt(0)}
            {author.lastName.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">
              {author.firstName} {author.lastName}
            </h1>

            <p className="mt-3 text-slate-600 dark:text-slate-400">
              {author.biography || "No biography available."}
            </p>

            <div className="mt-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {author.books.length} Book
              {author.books.length !== 1 && "s"} in Library
            </div>
          </div>
        </div>
      </div>

      {/* Books */}
      <div className="mt-12">
        <h2 className="mb-6 text-3xl font-bold">
          Books
        </h2>

        {author.books.length === 0 ? (
          <p className="text-slate-500">
            No books available.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {author.books.map((book) => (
              <div
                key={book.id}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <img
                  src={
                    book.coverImageUrl ||
                    "https://placehold.co/300x450/6366f1/ffffff?text=No+Cover"
                  }
                  alt={book.title}
                  className="h-72 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/300x450/6366f1/ffffff?text=No+Cover";
                  }}
                />

                <div className="flex flex-1 flex-col p-5">
                  {/* Top Content */}
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-base font-bold text-slate-900 dark:text-white">
                      {book.title}
                    </h3>

                    {book.subtitle && (
                      <p className="mt-1.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {book.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Bottom Content: Always pinned to bottom */}
                  <div className="mt-auto pt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {book.language}
                      </span>

                      <span
                        className={`font-semibold ${
                          book.availableCopies > 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {book.availableCopies > 0 ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Published: {book.publicationYear}
                    </p>

                    <Link
                      to={`/catalog/${book.id}`}
                      className="block w-full rounded-xl bg-indigo-600 py-2.5 text-center text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}