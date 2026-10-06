import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Barcode,
  Copy,
  Check,
  Search,
  BookOpen,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  RefreshCw,
} from "lucide-react";
import { useBookWithEtag } from "@/feature/catalog/hooks/useBook";
import {
  useBookCopies,
  useAddBookCopies,
  useDeleteBookCopy,
} from "@/feature/catalog/hooks/useBookCopies";
import type { BookCopy } from "@/feature/catalog/types";

const STATUS_CONFIG: Record<
  number,
  { label: string; bg: string; text: string; dot: string; icon: typeof CheckCircle2 }
> = {
  0: {
    label: "Available",
    bg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  1: {
    label: "On Loan",
    bg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    icon: Clock,
  },
  2: {
    label: "Overdue",
    bg: "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    icon: AlertTriangle,
  },
};

export default function ManageBookCopiesPage() {
  const { id } = useParams();
  const bookId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading: bookLoading, isError: bookError } = useBookWithEtag(bookId);
  const book = data?.book;
  const {
    data: copies = [],
    isLoading: copiesLoading,
    refetch,
  } = useBookCopies(bookId);

  const addCopiesMutation = useAddBookCopies(bookId);
  const deleteCopyMutation = useDeleteBookCopy(bookId);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "all">("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<"auto" | "custom">("auto");
  const [copyCount, setCopyCount] = useState("1");
  const [customBarcode, setCustomBarcode] = useState("");
  const [addError, setAddError] = useState("");

  // Delete modal state
  const [copyToDelete, setCopyToDelete] = useState<BookCopy | null>(null);

  // Copied barcode feedback
  const [copiedBarcode, setCopiedBarcode] = useState<string | null>(null);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedBarcode(text);
    setTimeout(() => setCopiedBarcode(null), 2000);
  }

  // Filtered copies
  const filteredCopies = useMemo(() => {
    return copies.filter((copy) => {
      const matchesSearch = copy.barcode
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const matchesStatus =
        statusFilter === "all" ? true : copy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [copies, searchTerm, statusFilter]);

  // Status counts
  const availableCount = copies.filter((c) => c.status === 0).length;
  const onLoanCount = copies.filter((c) => c.status === 1).length;
  const overdueCount = copies.filter((c) => c.status === 2).length;

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");

    if (addMode === "custom" && !customBarcode.trim()) {
      setAddError("Please enter a custom barcode.");
      return;
    }

    addCopiesMutation.mutate(
      {
        customBarcode: addMode === "custom" ? customBarcode.trim() : undefined,
        count: addMode === "auto" ? Math.max(1, Number(copyCount) || 1) : 1,
        status: 0,
      },
      {
        onSuccess: () => {
          setShowAddModal(false);
          setCustomBarcode("");
          setCopyCount("1");
        },
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (err: any) => {
          setAddError(
            err.response?.data?.message ||
            "Failed to add copy. Barcode may already exist."
          );
        },
      }
    );
  }

  function confirmDelete() {
    if (!copyToDelete) return;
    deleteCopyMutation.mutate(copyToDelete.id, {
      onSuccess: () => setCopyToDelete(null),
    });
  }

  if (bookLoading || copiesLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-6 w-36 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
        <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-500">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Book not found
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          We could not load information for this book.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Previous Page
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Top Bar ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Previous Page
          </button>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Manage Book Copies
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            title="Refresh copies"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setAddError("");
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Copies
          </button>
        </div>
      </div>

      {/* ── Book Info Banner ── */}
      <section className="flex flex-col gap-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm sm:flex-row sm:items-center">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="h-28 w-20 shrink-0 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-800"
          />
        ) : (
          <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
            <BookOpen className="h-8 w-8" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {book.language}
          </span>
          <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white truncate">
            {book.title}
          </h2>
          {book.subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {book.subtitle}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {book.isbN13 && <span>ISBN-13: {book.isbN13}</span>}
            <span>Year: {book.publicationYear}</span>
            {book.authors && book.authors.length > 0 && (
              <span>
                By: {book.authors.map((a) => a.name).join(", ")}
              </span>
            )}
          </div>
        </div>

        <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6">
          <Link
            to={`/catalog/${bookId}`}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View Book Page →
          </Link>
        </div>
      </section>

      {/* ── Status Metrics ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Copies
            </span>
            <Layers className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
            {copies.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Available
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
            {availableCount}
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              On Loan
            </span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-300">
            {onLoanCount}
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/30 p-5 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Overdue
            </span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-300">
            {overdueCount}
          </p>
        </div>
      </div>

      {/* ── Copies List Table ── */}
      <div className="space-y-4">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by barcode..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${statusFilter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              All ({copies.length})
            </button>
            <button
              onClick={() => setStatusFilter(0)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${statusFilter === 0
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Available ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter(1)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${statusFilter === 1
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              On Loan ({onLoanCount})
            </button>
            <button
              onClick={() => setStatusFilter(2)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${statusFilter === 2
                  ? "bg-rose-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              Overdue ({overdueCount})
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          {filteredCopies.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 mb-3">
                <Barcode className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No copies found
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try clearing your search or status filter."
                  : "No physical copies have been registered for this book yet."}
              </p>
              {copies.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add First Copy
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Copy Barcode</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredCopies.map((copy) => {
                    const statusCfg =
                      STATUS_CONFIG[copy.status] || STATUS_CONFIG[0];
                    const StatusIcon = statusCfg.icon;

                    return (
                      <tr
                        key={copy.id}
                        className="transition-colors hover:bg-slate-50/75 dark:hover:bg-slate-800/40"
                      >
                        {/* Barcode */}
                        <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Barcode className="h-4 w-4 text-indigo-500 shrink-0" />
                            <span>{copy.barcode}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(copy.barcode)}
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition"
                              title="Copy barcode"
                            >
                              {copiedBarcode === copy.barcode ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusCfg.bg} ${statusCfg.text}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                            />
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusCfg.label}
                          </span>
                        </td>

                        {/* Delete Action */}
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setCopyToDelete(copy)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Copies Modal ── */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Add Book Copies
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Register new physical copies into inventory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {addError && (
                <div className="mt-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddSubmit} className="mt-6 space-y-5">
                {/* Generation Mode Switch */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Barcode Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
                    <button
                      type="button"
                      onClick={() => setAddMode("auto")}
                      className={`rounded-lg py-2 text-xs font-bold transition ${addMode === "auto"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      Auto-Generate (LIB-...)
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddMode("custom")}
                      className={`rounded-lg py-2 text-xs font-bold transition ${addMode === "custom"
                          ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                          : "text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      Custom Barcode
                    </button>
                  </div>
                </div>

                {addMode === "auto" ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Number of copies to add
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={copyCount}
                      onChange={(e) => setCopyCount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Barcodes will be generated automatically as LIB-{bookId.toString().padStart(4, "0")}-XXX
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                      Custom Barcode *
                    </label>
                    <input
                      type="text"
                      value={customBarcode}
                      onChange={(e) => setCustomBarcode(e.target.value)}
                      placeholder="e.g. BARCODE-998822"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-mono"
                    />
                  </div>
                )}

                {/* Informational Note */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 text-xs text-slate-500 dark:text-slate-400">
                  <p>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Note:</span> Newly added copies are registered as <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">Available</strong>. Their status is automatically managed through loan checkouts, due-date tracking (overdue), and returns.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addCopiesMutation.isPending}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {addCopiesMutation.isPending ? "Adding..." : "Add Copies"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {copyToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCopyToDelete(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl border border-rose-100 dark:border-rose-900/50 bg-white dark:bg-slate-900 p-6 shadow-2xl z-10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Remove Book Copy?
              </h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Are you sure you want to remove copy{" "}
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {copyToDelete.barcode}
                </span>{" "}
                from inventory? This action cannot be undone.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCopyToDelete(null)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteCopyMutation.isPending}
                  onClick={confirmDelete}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
                >
                  {deleteCopyMutation.isPending ? "Removing..." : "Yes, Remove"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
