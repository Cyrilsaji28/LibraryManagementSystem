import type { ReactNode } from "react";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ThemeProvider } from "@/shared/context/ThemeContext.tsx";
import { AuthProvider } from "@/feature/auth/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes (no refetching)
      gcTime: 1000 * 60 * 10,    // Keep unused data in cache for 10 minutes
    },
  },
});

type Props = {
  children: ReactNode;
};

export function AppProviders({
  children,
}: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}