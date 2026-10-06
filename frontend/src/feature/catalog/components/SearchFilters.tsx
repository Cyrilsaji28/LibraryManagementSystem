import { Search, ChevronDown, X } from "lucide-react";
import { useCategories } from "../hooks/useCategory";
import { useLanguages } from "../hooks/useLanguage";

type Props = {
  search: string;
  category: string;
  language: string;
  availableOnly: boolean;
  sortBy: string;
  descending: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onAvailableOnlyChange: (value: boolean) => void;
  onSortChange: (sortBy: string, descending: boolean) => void;
};

const selectClass =
  "w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-400 cursor-pointer";

export default function SearchFilters({
  search,
  category,
  language,
  availableOnly,
  sortBy,
  descending,
  onSearchChange,
  onCategoryChange,
  onLanguageChange,
  onAvailableOnlyChange,
  onSortChange,
}: Props) {
  const { data: dbCategories, isLoading: isCategoriesLoading } = useCategories();
  const { data: dbLanguages, isLoading: isLanguagesLoading } = useLanguages();

  const categoryList = dbCategories?.map((c) => c.name) ?? [];
  const languageList = dbLanguages?.map((l) => l.name) ?? [];

  const activeFilters = [
    category && {
      label: category,
      onRemove: () => onCategoryChange(""),
    },
    language && {
      label: language,
      onRemove: () => onLanguageChange(""),
    },
    availableOnly && {
      label: "Available Only",
      onRemove: () => onAvailableOnlyChange(false),
    },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  return (
    <div className="space-y-4">
      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="book-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, author, or keyword..."
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:focus:border-indigo-400"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Filter Dropdowns ── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <div className="relative">
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={selectClass}
          >
            <option value="">
              {isCategoriesLoading ? "Loading categories..." : "All Categories"}
            </option>
            {categoryList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Language */}
        <div className="relative">
          <select
            id="language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className={selectClass}
          >
            <option value="">
              {isLanguagesLoading ? "Loading languages..." : "All Languages"}
            </option>
            {languageList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Availability */}
        <div className="relative">
          <select
            id="availability"
            value={availableOnly ? "available" : "all"}
            onChange={(e) =>
              onAvailableOnlyChange(e.target.value === "available")
            }
            className={selectClass}
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            id="sort"
            value={`${sortBy}-${descending}`}
            onChange={(e) => {
              const [newSortBy, newDesc] = e.target.value.split("-");
              onSortChange(newSortBy, newDesc === "true");
            }}
            className={selectClass}
          >
            <option value="title-false">Title: A → Z</option>
            <option value="title-true">Title: Z → A</option>
            <option value="year-false">Year: Oldest First</option>
            <option value="year-true">Year: Newest First</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* ── Active Filter Chips ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                className="hover:text-indigo-900 dark:hover:text-white transition-colors"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}