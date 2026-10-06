import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { useCreateLoan } from "../hooks/useLoans";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  bookTitle: string;
  onSuccess?: () => void;
}

const DURATION_OPTIONS = [
  { days: 7, label: "7 Days", desc: "Short loan / Quick read" },
  { days: 14, label: "14 Days", desc: "Standard loan duration" },
  { days: 21, label: "21 Days", desc: "Extended reading time" },
  { days: 30, label: "30 Days", desc: "Comprehensive research" },
];

export default function BorrowModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onSuccess,
}: Props) {
  const [selectedDays, setSelectedDays] = useState(14);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const createLoanMutation = useCreateLoan();
  const loading = createLoanMutation.isPending;

  const estimatedDueDate = new Date();
  estimatedDueDate.setDate(estimatedDueDate.getDate() + selectedDays);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    createLoanMutation.mutate(
      {
        bookId,
        bookTitle,
        requestedDays: selectedDays,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          if (onSuccess) onSuccess();
        },
        onError: (err: unknown) => {
          const apiErr = err as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          setError(
            apiErr.response?.data?.message ||
              apiErr.message ||
              "Failed to submit borrow request. Please try again."
          );
        },
      }
    );
  }

  function handleClose() {
    setError(null);
    setSubmitted(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Request Submitted!
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your request to borrow <strong>"{bookTitle}"</strong> has been sent to the library staff. You will be notified once a librarian approves it.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleClose}
                    className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Borrow Book Request
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {bookTitle}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Select Borrow Duration
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {DURATION_OPTIONS.map((opt) => (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => setSelectedDays(opt.days)}
                        className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all ${
                          selectedDays === opt.days
                            ? "border-indigo-600 bg-indigo-50/70 dark:border-indigo-500 dark:bg-indigo-950/50 shadow-sm"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {opt.label}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {opt.desc}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span>
                      Estimated return date:{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {estimatedDueDate.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </strong>
                    </span>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/80 p-3 text-xs text-rose-700 dark:text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Borrow Request"
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
