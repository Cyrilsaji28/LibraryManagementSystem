import { useQuery } from "@tanstack/react-query";
import { getBookById, getBookByIdWithEtag } from "../api/bookApi";

export function useBook(id: number) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    enabled: id > 0,
  });
}

export function useBookWithEtag(id: number) {
  return useQuery({
    queryKey: ["book-etag", id],
    queryFn: () => getBookByIdWithEtag(id),
    enabled: id > 0,
  });
}