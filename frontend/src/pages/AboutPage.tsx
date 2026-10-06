import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      {/* Header */}
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <BookOpen className="h-3.5 w-3.5" />
          About LibraryHub
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          About the Library System
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          LibraryHub is a centralized library management system designed to make cataloging,
          discovering books, and tracking inventory straightforward and accessible for everyone.
        </p>
      </div>

      {/* Main Info Box */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Core Features
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Book Catalog:</strong> Search and filter through titles by author, language, category, and ISBN.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Author Directory:</strong> Detailed author profiles including biographies and their full list of works.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Copy Inventory:</strong> Track the real-time physical availability of each copy (Available, On Loan, Overdue).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>
                <strong className="text-slate-900 dark:text-slate-200">Role-Based Access:</strong> Tailored permissions for Members, Librarians, and Administrators.
              </span>
            </li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <BookOpen className="h-4 w-4" />
            Go to Book Catalog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}