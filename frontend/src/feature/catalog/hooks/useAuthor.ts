import { useQuery } from "@tanstack/react-query";

import {
  getAuthors,
  type Author,
} from "../api/authorApi";

export function useAuthors(search?: string) {
  return useQuery<Author[]>({
    queryKey: ["authors", search],
    queryFn: () => getAuthors(search),
  });
}
