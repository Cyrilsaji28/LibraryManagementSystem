import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBookCopies,
  addBookCopies,
  updateBookCopyStatus,
  deleteBookCopy,
} from "../api/bookApi";
import type { AddBookCopyRequest } from "../types";

export function useBookCopies(bookId: number) {
  return useQuery({
    queryKey: ["book-copies", bookId],
    queryFn: () => getBookCopies(bookId),
    enabled: bookId > 0,
  });
}

export function useAddBookCopies(bookId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddBookCopyRequest) => addBookCopies(bookId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-copies", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book-etag", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateBookCopyStatus(bookId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ copyId, status }: { copyId: number; status: number }) =>
      updateBookCopyStatus(bookId, copyId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-copies", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book-etag", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteBookCopy(bookId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (copyId: number) => deleteBookCopy(bookId, copyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-copies", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", bookId] });
      queryClient.invalidateQueries({ queryKey: ["book-etag", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
