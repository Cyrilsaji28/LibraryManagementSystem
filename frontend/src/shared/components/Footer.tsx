import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm transition-transform group-hover:scale-105">
              <BookOpen className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              LibraryHub
            </span>
          </Link>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <Link
              to="/"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/catalog"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/authors"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Authors
            </Link>
            <Link
              to="/about"
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Copyright */}
          <p className="flex items-center justify-center gap-1.5 text-sm text-slate-400 dark:text-slate-500">
            Made with{" "}
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />{" "}
            · © {new Date().getFullYear()} LibraryHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
