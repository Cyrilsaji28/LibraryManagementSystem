import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Library,
} from "lucide-react";
import { useMyLoans, useCancelLoan } from "../hooks/useLoans";

export default function MyLoansPage() {
  const { data: loans = [], isLoading: loading, error: queryError, refetch } = useMyLoans();
  const cancelLoanMutation = useCancelLoan();
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const error = queryError ? (queryError as Error).message || "Failed to load your borrowings." : null;

  function handleCancelRequest(loanId: number) {
    if (!confirm("Are you sure you want to cancel this pending borrow request?")) return;
    setActionLoadingId(loanId);
    cancelLoanMutation.mutate(loanId, {
      onError: (err: unknown) => {
        const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
        alert(apiErr.response?.data?.message || apiErr.message || "Failed to cancel request.");
      },
      onSettled: () => {
        setActionLoadingId(null);
      },
    });
  }

  const activeCount = loans.filter((l) => l.status === "Approved").length;
  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const returnedCount = loans.filter((l) => l.status === "Returned").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Borrowings
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your book borrow requests, active loans, and return deadlines.
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Library className="h-4 w-4" />
          Browse Catalog
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Currently Borrowed
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-100 dark:border-amber-950 bg-amber-50/50 dark:bg-amber-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950 bg-emerald-50/50 dark:bg-emerald-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Returned Books
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {returnedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-500">Loading your loans...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : loans.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No borrow history yet
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Find a book in the catalog and submit a borrow request to start reading.
            </p>
            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Requested</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Action / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loans.map((loan) => {
                  const isOverdue = loan.isOverdue;
                  return (
                    <motion.tr
                      key={loan.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/catalog/${loan.bookId}`}
                          className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                          {loan.bookTitle}
                        </Link>
                        {loan.bookCopyId && (
                          <p className="text-xs text-slate-400">Copy #{loan.bookCopyId}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={loan.status} isOverdue={isOverdue} />
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {new Date(loan.requestedAt).toLocaleDateString()}
                        <span className="block text-xs text-slate-400">
                          {loan.requestedDays} days limit
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {loan.dueDate ? (
                          <div>
                            <span
                              className={`font-semibold ${
                                isOverdue
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              {new Date(loan.dueDate).toLocaleDateString()}
                            </span>
                            {isOverdue && (
                              <span className="block text-xs font-bold text-rose-500">
                                Overdue!
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {loan.status === "Pending" ? (
                          <button
                            onClick={() => handleCancelRequest(loan.id)}
                            disabled={actionLoadingId === loan.id}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-50"
                          >
                            {actionLoadingId === loan.id ? "Cancelling..." : "Cancel Request"}
                          </button>
                        ) : loan.reviewRemarks ? (
                          <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                            "{loan.reviewRemarks}"
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  isOverdue,
}: {
  status: string;
  isOverdue?: boolean;
}) {
  if (isOverdue && status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
        <AlertTriangle className="h-3 w-3" />
        Overdue
      </span>
    );
  }

  switch (status) {
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <Clock className="h-3 w-3" />
          Pending Review
        </span>
      );
    case "Approved":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" />
          Active Loan
        </span>
      );
    case "Rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 dark:bg-rose-950/80 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <XCircle className="h-3 w-3" />
          Rejected
        </span>
      );
    case "Returned":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <RotateCcw className="h-3 w-3" />
          Returned
        </span>
      );
    case "Cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
          Cancelled
        </span>
      );
    default:
      return <span>{status}</span>;
  }
}
