import { createBrowserRouter } from "react-router-dom";

import App from "./App";

// Top-level / Marketing Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";

// Auth Feature
import LoginPage from "@/feature/auth/pages/LoginPage";
import RegisterPage from "@/feature/auth/pages/RegisterPage";
import ProtectedRoute from "@/feature/auth/components/ProtectedRoute";

// Author Feature
import AuthorsPage from "@/feature/author/pages/AuthorsPage";
import AuthorDetailsPage from "@/feature/author/pages/AuthorDetailsPage";

// Catalog & Inventory Feature
import CatalogPage from "@/feature/catalog/pages/CatalogPage";
import BookDetailsPage from "@/feature/catalog/pages/BookDetailsPage";
import AddBookPage from "@/feature/catalog/pages/AddBookPage";
import EditBookPage from "@/feature/catalog/pages/EditBookPage";
import ManageBookCopiesPage from "@/feature/catalog/pages/ManageBookCopiesPage";

// Borrowing Feature
import MyLoansPage from "@/feature/borrowing/pages/MyLoansPage";
import LibrarianLoansPage from "@/feature/borrowing/pages/LibrarianLoansPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/catalog",
        element: (
          <ProtectedRoute>
            <CatalogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/authors",
        element: (
          <ProtectedRoute>
            <AuthorsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "about",
        element: (
          <ProtectedRoute>
            <AboutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "catalog/:id",
        element: (
          <ProtectedRoute>
            <BookDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "catalog/books/:id",
        element: (
          <ProtectedRoute>
            <BookDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/authors/:id",
        element: (
          <ProtectedRoute>
            <AuthorDetailsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/books/add",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <AddBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/:id/edit",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <EditBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/catalog/:id/edit",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <EditBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/books/:id/copies",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <ManageBookCopiesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/catalog/:id/copies",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <ManageBookCopiesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-loans",
        element: (
          <ProtectedRoute>
            <MyLoansPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/loans/manage",
        element: (
          <ProtectedRoute roles={["Librarian", "Admin"]}>
            <LibrarianLoansPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);