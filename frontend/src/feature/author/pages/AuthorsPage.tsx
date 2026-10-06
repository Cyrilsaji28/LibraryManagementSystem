import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, X, BookOpen, AlertCircle } from "lucide-react";
import { useAuthors } from "@/feature/author/hooks/useAuthor";
import AuthorCard from "@/feature/author/components/AuthorCard";

export default function AuthorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: authors, isLoading, isError, refetch } = useAuthors(searchTerm);

  return (
    <div className="space-y-8">
      {/* ── Hero Banner ── */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Users className="h-3.5 w-3.5" />
            Literary Creators
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Meet the Authors
          </h1>
          <p className="mt-3 text-base text-indigo-100 sm:text-lg leading-relaxed">
            Discover the brilliant minds behind our book collection. Explore
            their biographies and find all titles penned by your favorite
            writers.
          </p>
        </div>
      </section>

      {/* ── Search Bar Section ── */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search authors by name..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 py-3 pl-12 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </section>

      {/* ── Results Count ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Authors in Library
        </h2>
        {!isLoading && authors && (
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {authors.length} {authors.length === 1 ? "author" : "authors"} found
          </span>
        )}
      </div>

      {/* ── Loading Skeletons ── */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              <div className="h-24 bg-slate-200 dark:bg-slate-800" />
              <div className="p-6 pt-0 -mt-10">
                <div className="h-20 w-20 rounded-2xl bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900 mb-4" />
                <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 mb-2" />
                <div className="h-4 w-full rounded bg-slate-100 dark:bg-slate-800/60 mb-1" />
                <div className="h-4 w-2/3 rounded bg-slate-100 dark:bg-slate-800/60 mb-6" />
                <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ── */}
      {isError && (
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 mb-4">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Failed to load authors
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            There was an error connecting to the server. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && !isError && authors && authors.length === 0 && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
            <BookOpen className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No authors found
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? `We couldn't find any authors matching "${searchTerm}". Try a different name.`
              : "No authors have been added to the library catalog yet."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* ── Authors Grid ── */}
      {!isLoading && !isError && authors && authors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {authors.map((author, index) => (
            <AuthorCard key={author.id} author={author} index={index} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
