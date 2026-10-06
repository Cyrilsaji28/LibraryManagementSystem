
import { useQuery } from "@tanstack/react-query";
import { getBooks } from "../api/bookApi";
import type { BookSearchParams } from "../types";

export function useBooks(params?: BookSearchParams) {
  return useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
  });
}

