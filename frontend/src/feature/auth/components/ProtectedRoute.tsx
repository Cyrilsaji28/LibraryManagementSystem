import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactNode;
  roles?: ("Member" | "Librarian" | "Admin")[];
};

export default function ProtectedRoute({
  children,
  roles,
}: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    roles &&
    (!user || !roles.includes(user.role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}