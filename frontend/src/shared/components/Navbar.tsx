import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Home,
  Library,
  Users,
  Info,
  PlusCircle,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  BookCheck,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/feature/auth/context/AuthContext";
import { useTheme } from "@/shared/context/ThemeContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    navigate("/login");
    setMobileOpen(false);
    setUserMenuOpen(false);
  }

  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950"
        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <>
      {/* ── Top Navbar ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm"
            : "bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-lg text-slate-900 dark:text-white hover:opacity-80 transition-opacity shrink-0"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-sm">
              <BookOpen className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span>LibraryHub</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-0.5">
            <NavLink to="/" end className={desktopLinkClass}>
              <Home className="h-3.5 w-3.5" />
              Home
            </NavLink>
            <NavLink to="/catalog" className={desktopLinkClass}>
              <Library className="h-3.5 w-3.5" />
              Catalog
            </NavLink>
            <NavLink to="/authors" className={desktopLinkClass}>
              <Users className="h-3.5 w-3.5" />
              Authors
            </NavLink>
            <NavLink to="/about" className={desktopLinkClass}>
              <Info className="h-3.5 w-3.5" />
              About
            </NavLink>
            {isAuthenticated && user?.role === "Member" && (
              <NavLink to="/my-loans" className={desktopLinkClass}>
                <BookCheck className="h-3.5 w-3.5" />
                My Loans
              </NavLink>
            )}
            {isAuthenticated && (user?.role === "Librarian" || user?.role === "Admin") && (
              <>
                <NavLink to="/books/add" className={desktopLinkClass}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  Add Book
                </NavLink>
                <NavLink to="/loans/manage" className={desktopLinkClass}>
                  <ClipboardList className="h-3.5 w-3.5" />
                  Circulation
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hidden md:flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
            >
              {theme === "light"
                ? <Moon className="h-4 w-4" />
                : <Sun className="h-4 w-4" />}
            </button>

            {isAuthenticated && user ? (
              /* User dropdown */
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white select-none">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                    {user.firstName}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 z-20 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
                      >
                        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {user.role}
                          </p>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <BookOpen className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    LibraryHub
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Nav */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                <NavLink
                  to="/"
                  end
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </NavLink>
                <NavLink
                  to="/catalog"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <Library className="h-5 w-5" />
                  Catalog
                </NavLink>
                <NavLink
                  to="/authors"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  Authors
                </NavLink>
                <NavLink
                  to="/about"
                  className={mobileLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  <Info className="h-5 w-5" />
                  About
                </NavLink>
                {isAuthenticated && user?.role === "Member" && (
                  <NavLink
                    to="/my-loans"
                    className={mobileLinkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    <BookCheck className="h-5 w-5" />
                    My Loans
                  </NavLink>
                )}
                {isAuthenticated && (user?.role === "Librarian" || user?.role === "Admin") && (
                  <>
                    <NavLink
                      to="/books/add"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      <PlusCircle className="h-5 w-5" />
                      Add Book
                    </NavLink>
                    <NavLink
                      to="/loans/manage"
                      className={mobileLinkClass}
                      onClick={() => setMobileOpen(false)}
                    >
                      <ClipboardList className="h-5 w-5" />
                      Circulation
                    </NavLink>
                  </>
                )}
              </nav>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-900">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.role}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                )}

                {/* Theme toggle */}
                <div className="flex justify-center pt-1">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {theme === "light" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                    {theme === "light" ? "Dark Mode" : "Light Mode"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
