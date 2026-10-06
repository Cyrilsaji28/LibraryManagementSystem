import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, X, Search } from "lucide-react";

export interface MultiSelectOption {
  id: number;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  required?: boolean;
  options: MultiSelectOption[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  helperText?: string;
}

export default function MultiSelectDropdown({
  label,
  required = false,
  options,
  selectedIds,
  onChange,
  placeholder = "Select options...",
  loading = false,
  error = false,
  errorMessage,
  disabled = false,
  helperText,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery]);

  const selectedOptions = useMemo(() => {
    return options.filter((opt) => selectedIds.includes(opt.id));
  }, [options, selectedIds]);

  function handleToggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  function handleSelectAll() {
    const allFilteredIds = filteredOptions.map((opt) => opt.id);
    const newSelected = Array.from(new Set([...selectedIds, ...allFilteredIds]));
    onChange(newSelected);
  }

  function handleClearAll() {
    onChange([]);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`mt-2 flex min-h-12 w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2.5 text-left text-sm transition outline-none dark:bg-gray-900 ${
          isOpen
            ? "border-blue-500 ring-2 ring-blue-100 dark:border-blue-400 dark:ring-blue-900/30"
            : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
        } ${
          disabled || loading
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5 overflow-hidden">
          {loading ? (
            <span className="text-gray-400">Loading options...</span>
          ) : selectedOptions.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500">
              {placeholder}
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              {selectedOptions.slice(0, 3).map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                >
                  {item.label}
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                        handleToggle(item.id);
                      }
                    }}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))}
              {selectedOptions.length > 3 && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  +{selectedOptions.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
          {selectedIds.length > 0 && !disabled && (
            <span
              role="button"
              tabIndex={0}
              title="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  handleClearAll();
                }
              }}
              className="rounded p-0.5 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-900 animate-in fade-in-50 zoom-in-95 duration-100">
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
              autoFocus
            />
          </div>

          {/* Quick Select Actions */}
          <div className="mb-2 flex items-center justify-between border-b border-gray-100 px-1 pb-1.5 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <span>
              {selectedIds.length} of {options.length} selected
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Select all
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleClearAll}
                className="font-medium text-gray-600 hover:underline dark:text-gray-400"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-400 dark:text-gray-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? "bg-blue-50/70 font-medium text-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(option.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                    />
                    <span className="flex-1 select-none">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Helper text or error message */}
      {error && errorMessage ? (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
