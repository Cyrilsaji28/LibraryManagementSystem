import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/feature/auth/context/AuthContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    : "";

  const navClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `flex items-center rounded-xl px-4 py-3 transition ${isActive
      ? "bg-blue-600 text-white"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    }`;

  function closeSidebar() {
    setIsOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
    closeSidebar();
  }

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-700"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-950 ${isOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={closeSidebar}
          >
            <span className="text-3xl">📚</span>

            <span className="text-xl font-bold">
              Library
            </span>
          </Link>

          <button
            onClick={closeSidebar}
            className="text-2xl text-slate-600 transition hover:text-red-600 dark:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={navClass}
            onClick={closeSidebar}
          >
            🏠
            <span className="ml-3">Home</span>
          </NavLink>

          <NavLink
            to="/catalog"
            className={navClass}
            onClick={closeSidebar}
          >
            📚
            <span className="ml-3">
              Catalog
            </span>
          </NavLink>

          <NavLink
            to="/about"
            className={navClass}
            onClick={closeSidebar}
          >
            ℹ️
            <span className="ml-3">About</span>
          </NavLink>

          {/* Member */}
          {isAuthenticated &&
            user?.role === "Member" && (
              <NavLink
                to="/my-books"
                className={navClass}
                onClick={closeSidebar}
              >
                ❤️
                <span className="ml-3">
                  My Books
                </span>
              </NavLink>
            )}

          {/* Librarian */}
          {isAuthenticated &&
            user?.role === "Librarian" && (
              <>

                <NavLink
                  to="/manage-books"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  ➕
                  <span className="ml-3">
                    Manage Books
                  </span>
                </NavLink>

                <NavLink
                  to="/books/add"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  📖
                  <span className="ml-3">
                    Add Book
                  </span>
                </NavLink>

                <NavLink
                  to="/inventory"
                  className={navClass}
                  onClick={() => setIsOpen(false)}
                >
                  📦
                  <span className="ml-3">
                    Inventory
                  </span>
                </NavLink>
              </>
            )}
          {/* Admin */}
          {isAuthenticated &&
            user?.role === "Admin" && (
              <>
                <NavLink
                  to="/users"
                  className={navClass}
                  onClick={closeSidebar}
                >
                  👥
                  <span className="ml-3">
                    Users
                  </span>
                </NavLink>

                <NavLink
                  to="/settings"
                  className={navClass}
                  onClick={closeSidebar}
                >
                  ⚙️
                  <span className="ml-3">
                    Settings
                  </span>
                </NavLink>
              </>
            )}
        </nav>

        {/* Bottom */}
        <div className="mt-auto border-t border-slate-200 pt-6 dark:border-slate-700">
          {isAuthenticated && user ? (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {initials}
                </div>

                <div>
                  <p className="font-semibold">
                    {user.firstName}{" "}
                    {user.lastName}
                  </p>

                  <p className="text-sm text-slate-500">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mb-4 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <Link
                to="/login"
                onClick={closeSidebar}
                className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeSidebar}
                className="block rounded-xl border border-slate-300 px-4 py-3 text-center font-semibold transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Register
              </Link>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}