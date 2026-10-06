import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Tag,
  Calendar,
  Globe,
  Hash,
  Copy,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Layers,
  BookCheck,
} from "lucide-react";
import { useBookWithEtag } from "../hooks/useBook";
import { useDeleteBook } from "@/feature/catalog/hooks/useDeleteBook";
import { useAuth } from "@/feature/auth/context/AuthContext";
import BorrowModal from "@/feature/borrowing/components/BorrowModal";

export default function BookDetailsPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const { data, isLoading, isError } = useBookWithEtag(bookId);
  const book = data?.book
  const deleteBookMutation = useDeleteBook();

  const canEdit =
    isAuthenticated &&
    (user?.role === "Librarian" || user?.role === "Admin");

  function handleDeleteConfirm() {
    setDeleteError("");
    deleteBookMutation.mutate(bookId, {
      onSuccess: () => {
        navigate("/catalog");
      },
      onError: (err) => {
        const apiErr = err as unknown as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setDeleteError(
          apiErr?.response?.data?.message || "Failed to delete book. Please try again."
        );
      },
    });
  }


  const isAvailable = (book?.availableCopies ?? 0) > 0;

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="animate-pulse">
          <div className="skeleton mb-6 h-5 w-32 rounded" />
          <div className="grid gap-8 md:grid-cols-3">
            <div className="skeleton h-[480px] rounded-2xl" />
            <div className="space-y-4 md:col-span-2">
              <div className="skeleton h-10 w-3/4 rounded" />
              <div className="skeleton h-5 w-1/2 rounded" />
              <div className="skeleton h-32 rounded" />
              <div className="skeleton h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !book) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <BookOpen className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Book not found
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          We couldn't find the requested book.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>
      </div>
    );
  }

  const availabilityStats = [
    {
      label: "Total Copies",
      value: book.totalCopies,
      color: "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700",
      text: "text-slate-900 dark:text-white",
    },
    {
      label: "Available",
      value: book.availableCopies,
      color: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
    },
    {
      label: "On Loan",
      value: book.onLoanCopies,
      color: "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-300",
    },
    {
      label: "Overdue",
      value: book.overdueCopies ?? 0,
      color: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800",
      text: "text-rose-700 dark:text-rose-300",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* ── Top Bar: Back & Admin Actions ── */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/books/${bookId}/copies`}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-4 py-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all hover:shadow-md"
            >
              <Layers className="h-4 w-4" />
              Manage Copies
            </Link>

            <Link
              to={`/books/${bookId}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md"
            >
              <Pencil className="h-4 w-4" />
              Edit Book
            </Link>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 px-4 py-2 text-sm font-bold text-rose-600 dark:text-rose-400 shadow-sm hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-all hover:shadow-md"
            >
              <Trash2 className="h-4 w-4" />
              Delete Book
            </button>
          </div>
        )}
      </div>

      {/* ── Main Book Section ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="grid gap-8 md:grid-cols-3"
      >
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xl">
            <img
              src={book.coverImageUrl || "https://placehold.co/400x600/6366f1/ffffff?text=No+Cover"}
              alt={book.title}
              className="h-auto max-h-[500px] w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x600/6366f1/ffffff?text=No+Cover";
              }}
            />
          </div>
        </div>

        {/* Info Panel */}
        <div className="md:col-span-2 space-y-6">
          {/* Availability & Borrow actions */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${isAvailable
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-slate-400"
                  }`}
              />
              {isAvailable ? "Available to browse" : "Currently Unavailable"}
            </span>

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowBorrowModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                <BookCheck className="h-4 w-4" />
                Borrow Book
              </button>
            )}
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
              {book.title}
            </h1>
            {book.subtitle && (
              <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
                {book.subtitle}
              </p>
            )}
          </div>

          {/* Authors */}
          {book.authors.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Users className="h-3.5 w-3.5" />
                {book.authors.length === 1 ? "Author" : "Authors"}
              </div>
              <div className="flex flex-wrap gap-2">
                {book.authors.map((author) => (
                  <Link
                    key={author.id}
                    to={`/authors/${author.id}`}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                  >
                    {author.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {book.categories.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Tag className="h-3.5 w-3.5" />
                Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {book.summary && (
            <div>
              <h2 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
                About this book
              </h2>
              <p className="leading-7 text-slate-600 dark:text-slate-400">
                {book.summary}
              </p>
            </div>
          )}

          {/* Metadata grid */}
          <div className="grid gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-5 sm:grid-cols-2">
            {[
              {
                icon: Hash,
                label: "ISBN-10",
                value: book.isbN10 || (book as Record<string, unknown>).isbn10 as string | undefined,
              },
              {
                icon: Hash,
                label: "ISBN-13",
                value: book.isbN13 || (book as Record<string, unknown>).isbn13 as string | undefined,
              },
              { icon: Copy, label: "Edition", value: book.edition },
              {
                icon: Calendar,
                label: "Publication Year",
                value: book.publicationYear?.toString(),
              },
              { icon: Globe, label: "Language", value: book.language },
            ]
              .filter((m) => m.value)
              .map((meta) => {
                const Icon = meta.icon;
                return (
                  <div key={meta.label} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Icon className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {meta.label}
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {meta.value}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </motion.div>

      {/* ── Availability Panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="mt-12"
      >
        <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
          Availability
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {availabilityStats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-5 ${stat.color}`}
            >
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className={`mt-2 text-3xl font-bold ${stat.text}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Soft Delete Confirmation Modal ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!deleteBookMutation.isPending) setShowDeleteModal(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteBookMutation.isPending}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Delete Book
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Are you sure you want to delete{" "}
                    <strong className="font-semibold text-slate-900 dark:text-white">
                      "{book.title}"
                    </strong>
                    ? This will perform a soft delete, removing it from active
                    catalog listings and search results.
                  </p>
                </div>
              </div>

              {/* Error in modal */}
              {deleteError && (
                <div className="mt-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/80 p-3 text-xs font-semibold text-red-700 dark:text-red-300">
                  {deleteError}
                </div>
              )}

              {/* Modal Actions */}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteBookMutation.isPending}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={deleteBookMutation.isPending}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleteBookMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Yes, Delete Book
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Borrow Book Modal ── */}
      <BorrowModal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        bookId={book.id}
        bookTitle={book.title}
      />
    </div>
  );
}