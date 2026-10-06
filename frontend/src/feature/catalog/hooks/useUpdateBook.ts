import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBook } from "../api/bookApi";
import type { UpdateBookRequest } from "../types";

export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
      etag,
    }: {
      id: number;
      request: UpdateBookRequest;
      etag: string;
    }) => updateBook(id, request, etag),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["book-etag", variables.id] });
    },
  });
}
