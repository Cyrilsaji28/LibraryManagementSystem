import { Link } from "react-router-dom";
import { BookOpen, Users, Layers, ArrowRight } from "lucide-react";
import { useAuth } from "@/feature/auth/context/AuthContext";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="mx-auto max-w-4xl space-y-12 py-6">
      {/* Hero */}
      <section className="text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
          <BookOpen className="h-3.5 w-3.5" />
          Library Management System
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Welcome to LibraryHub
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
          Browse our book catalog, search titles by category and language, and check physical copy availability.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <BookOpen className="h-4 w-4" />
            Browse Catalog
            <ArrowRight className="h-4 w-4" />
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign In
            </Link>
          )}
        </div>
      </section>

      {/* Highlights */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Catalog</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search books across multiple genres, languages, and editions.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Authors</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Explore author profiles, biographies, and their cataloged works.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Availability</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Track physical copy barcodes with status: Available, On Loan, or Overdue.
          </p>
        </div>
      </section>
    </div>
  );
}