import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  User,
  Check,
  X,
  Search,
} from "lucide-react";
import {
  useAllLoans,
  useApproveLoan,
  useRejectLoan,
  useReturnLoan,
} from "../hooks/useLoans";
import { useBookCopies } from "@/feature/catalog/hooks/useBookCopies";
import type { LoanResponseDto } from "../types";

export default function LibrarianLoansPage() {
  const { data: loans = [], isLoading: loading, error: queryError } = useAllLoans();
  const approveMutation = useApproveLoan();
  const rejectMutation = useRejectLoan();
  const returnMutation = useReturnLoan();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [selectedLoan, setSelectedLoan] = useState<LoanResponseDto | null>(null);
  const [modalMode, setModalMode] = useState<"approve" | "reject" | "return" | null>(null);
  const [copyIdInput, setCopyIdInput] = useState<string>("");
  const [remarksInput, setRemarksInput] = useState<string>("");

  const submitting =
    approveMutation.isPending || rejectMutation.isPending || returnMutation.isPending;
  const error = queryError ? (queryError as Error).message || "Failed to load loan requests." : null;

  const approveBookId = modalMode === "approve" && selectedLoan ? selectedLoan.bookId : 0;
  const { data: bookCopies = [], isLoading: copiesLoading } = useBookCopies(approveBookId);
  const availableCopies = bookCopies.filter((copy) => copy.status === 0);

  function openApproveModal(loan: LoanResponseDto) {
    setSelectedLoan(loan);
    setCopyIdInput(loan.bookCopyId ? loan.bookCopyId.toString() : "");
    setRemarksInput("");
    setModalMode("approve");
  }

  function openRejectModal(loan: LoanResponseDto) {
    setSelectedLoan(loan);
    setRemarksInput("");
    setModalMode("reject");
  }

  function openReturnModal(loan: LoanResponseDto) {
    setSelectedLoan(loan);
    setRemarksInput("");
    setModalMode("return");
  }

  function closeModal() {
    setSelectedLoan(null);
    setModalMode(null);
    setCopyIdInput("");
    setRemarksInput("");
  }

  function handleModalSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedLoan || !modalMode) return;

    if (modalMode === "approve") {
      approveMutation.mutate(
        {
          id: selectedLoan.id,
          dto: {
            bookCopyId: copyIdInput ? Number(copyIdInput) : undefined,
            remarks: remarksInput || undefined,
          },
        },
        {
          onSuccess: () => closeModal(),
          onError: (err: unknown) => {
            const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
            alert(apiErr.response?.data?.message || apiErr.message || "Approval failed.");
          },
        }
      );
    } else if (modalMode === "reject") {
      if (!remarksInput.trim()) {
        alert("Please provide a reason for rejecting this loan request.");
        return;
      }
      rejectMutation.mutate(
        {
          id: selectedLoan.id,
          dto: { reason: remarksInput.trim() },
        },
        {
          onSuccess: () => closeModal(),
          onError: (err: unknown) => {
            const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
            alert(apiErr.response?.data?.message || apiErr.message || "Rejection failed.");
          },
        }
      );
    } else if (modalMode === "return") {
      returnMutation.mutate(
        {
          id: selectedLoan.id,
          remarks: remarksInput || undefined,
        },
        {
          onSuccess: () => closeModal(),
          onError: (err: unknown) => {
            const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
            alert(apiErr.response?.data?.message || apiErr.message || "Return failed.");
          },
        }
      );
    }
  }

  // Filtered loans
  const filteredLoans = loans.filter((loan) => {
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Overdue" ? loan.isOverdue : loan.status === statusFilter);

    const matchesSearch =
      loan.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.userEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const activeCount = loans.filter((l) => l.status === "Approved").length;
  const overdueCount = loans.filter((l) => l.isOverdue).length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Circulation & Loan Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review member borrow requests, authorize loans, and process book returns.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {pendingCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Loans
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Overdue Loans
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {overdueCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Approved", "Overdue", "Returned", "Rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                statusFilter === tab
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {tab}
              {tab === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.2 text-[10px] font-extrabold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search book or member..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-500">Loading loans data...</p>
          </div>
        ) : error ? (
          <div className="p-16 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">{error}</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              No loans match the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Book Title</th>
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Requested / Limit</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4 text-right">Librarian Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLoans.map((loan) => (
                  <tr
                    key={loan.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/catalog/${loan.bookId}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        {loan.bookTitle}
                      </Link>
                      {loan.bookCopyId ? (
                        <p className="text-xs text-slate-400">Copy #{loan.bookCopyId}</p>
                      ) : (
                        <p className="text-xs text-amber-500">Unassigned copy</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {loan.userFullName}
                          </p>
                          <p className="text-xs text-slate-400">{loan.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={loan.status} isOverdue={loan.isOverdue} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(loan.requestedAt).toLocaleDateString()}
                      <span className="block text-xs font-semibold text-indigo-500">
                        {loan.requestedDays} days requested
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {loan.dueDate ? (
                        <div>
                          <span
                            className={`font-semibold ${
                              loan.isOverdue
                                ? "text-rose-600 dark:text-rose-400"
                                : "text-slate-900 dark:text-white"
                            }`}
                          >
                            {new Date(loan.dueDate).toLocaleDateString()}
                          </span>
                          {loan.isOverdue && (
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
                      {loan.status === "Pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openApproveModal(loan)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(loan)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      )}

                      {loan.status === "Approved" && (
                        <button
                          onClick={() => openReturnModal(loan)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Mark Returned
                        </button>
                      )}

                      {loan.status === "Returned" && (
                        <span className="text-xs text-slate-400">
                          Returned {new Date(loan.returnedAt!).toLocaleDateString()}
                        </span>
                      )}

                      {loan.status === "Rejected" && (
                        <span className="text-xs text-rose-400 italic">
                          "{loan.reviewRemarks}"
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Dialog Modal */}
      <AnimatePresence>
        {modalMode && selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>

              <form onSubmit={handleModalSubmit}>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {modalMode === "approve" && "Approve Loan Request"}
                  {modalMode === "reject" && "Reject Loan Request"}
                  {modalMode === "return" && "Mark Book as Returned"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Book: <strong>{selectedLoan.bookTitle}</strong> for{" "}
                  <strong>{selectedLoan.userFullName}</strong>
                </p>

                <div className="mt-5 space-y-4">
                  {modalMode === "approve" && (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                            Select Available Book Copy
                          </label>
                          {!copiesLoading && (
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              {availableCopies.length} {availableCopies.length === 1 ? "copy" : "copies"} available
                            </span>
                          )}
                        </div>

                        {copiesLoading ? (
                          <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs text-slate-400">
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                            Loading available copies...
                          </div>
                        ) : availableCopies.length === 0 ? (
                          <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                              <div>
                                <p className="font-bold">No available copies</p>
                                <p className="mt-0.5">All physical copies of this book are currently on loan or overdue.</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <select
                              value={copyIdInput}
                              onChange={(e) => setCopyIdInput(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                            >
                              <option value="">
                                Auto-assign first available (Copy #{availableCopies[0].id})
                              </option>
                              {availableCopies.map((copy) => (
                                <option key={copy.id} value={copy.id.toString()}>
                                  Copy #{copy.id} — Barcode: {copy.barcode}
                                </option>
                              ))}
                            </select>

                            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                              {availableCopies.map((copy) => {
                                const isSelected =
                                  copyIdInput === copy.id.toString() ||
                                  (!copyIdInput && availableCopies[0]?.id === copy.id);
                                return (
                                  <button
                                    key={copy.id}
                                    type="button"
                                    onClick={() => setCopyIdInput(copy.id.toString())}
                                    className={`flex w-full items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                                      isSelected
                                        ? "border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/50"
                                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                                        Copy #{copy.id}
                                      </span>
                                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                        {copy.barcode}
                                      </span>
                                    </div>
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                                      Available
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Notes / Remarks (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. In good condition"
                          value={remarksInput}
                          onChange={(e) => setRemarksInput(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </>
                  )}

                  {modalMode === "reject" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Reason for Rejection *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="e.g. Copy currently damaged or under maintenance"
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {modalMode === "return" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Return Condition / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Returned on time, excellent condition"
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      (modalMode === "approve" && !copiesLoading && availableCopies.length === 0)
                    }
                    className={`rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
                      modalMode === "reject"
                        ? "bg-rose-600 hover:bg-rose-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {submitting ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
          Pending
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
    default:
      return <span>{status}</span>;
  }
}
