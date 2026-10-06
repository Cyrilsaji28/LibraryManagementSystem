import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createBook } from "../api/bookApi";
import type { CreateBookRequest } from "../types";


export function useCreateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateBookRequest) =>
      createBook(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

