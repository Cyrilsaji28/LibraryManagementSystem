import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "../api/bookApi";

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
