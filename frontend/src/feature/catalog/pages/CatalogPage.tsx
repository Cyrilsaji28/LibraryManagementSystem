import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, SlidersHorizontal, X } from "lucide-react";

import SearchFilters from "@/feature/catalog/components/SearchFilters";
import BookList from "@/feature/catalog/components/BookList";
import Pagination from "@/feature/catalog/components/Pagination";
import { useBooks } from "@/feature/catalog/hooks/useBooks";
import type { BookSearchParams } from "@/feature/catalog/types";

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [descending, setDescending] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const searchParams: BookSearchParams = {
    Q: search || undefined,
    Category: category || undefined,
    Language: language || undefined,
    AvailableOnly: availableOnly ? true : undefined,
    SortBy: sortBy,
    Descending: descending,
    Page: page,
    Size: 20,
  };

  const { data, isLoading, error } = useBooks(searchParams);

  const hasActiveFilters = !!(search || category || language || availableOnly);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }
  function handleCategoryChange(value: string) {
    setCategory(value);
    setPage(1);
  }
  function handleLanguageChange(value: string) {
    setLanguage(value);
    setPage(1);
  }
  function handleAvailableOnlyChange(value: boolean) {
    setAvailableOnly(value);
    setPage(1);
  }
  function handleSortChange(newSortBy: string, newDescending: boolean) {
    setSortBy(newSortBy);
    setDescending(newDescending);
    setPage(1);
  }
  function handleClearFilters() {
    setSearch("");
    setCategory("");
    setLanguage("");
    setAvailableOnly(false);
    setSortBy("title");
    setDescending(false);
    setPage(1);
  }

  return (
    <div className="space-y-8">

      {/* ── Search & Filters ── */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Find a Book
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Search and filter our library collection.
            </p>
          </div>
          <button
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersVisible ? "Hide" : "Show"} Filters
          </button>
        </div>

        {filtersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SearchFilters
              search={search}
              category={category}
              language={language}
              availableOnly={availableOnly}
              sortBy={sortBy}
              descending={descending}
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onLanguageChange={handleLanguageChange}
              onAvailableOnlyChange={handleAvailableOnlyChange}
              onSortChange={handleSortChange}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Clear all filters
              </button>
            )}
          </motion.div>
        )}
      </section>

      {/* ── Results Header ── */}
      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Books
          </h2>
          {!isLoading && data && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {data.items.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {data.totalItems}
              </span>{" "}
              books
            </p>
          )}
        </div>

        {hasActiveFilters && (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            <BookOpen className="h-3 w-3" />
            Filters active
          </span>
        )}
      </section>

      {/* ── Book Grid ── */}
      <BookList data={data} isLoading={isLoading} error={error} />

      {/* ── Pagination ── */}
      {!isLoading && !error && data && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
