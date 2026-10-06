import { useQuery } from "@tanstack/react-query";
import { getAuthor, getAuthors } from "../api/authorApi";

export function useAuthors(search?: string) {

  if (search == "") { // added this to avoid multiple author api calls while using addbook page and authors page(Normalizing both)
    search = undefined;
  }

  return useQuery({
    queryKey: ["authors", search],
    queryFn: () => getAuthors(search),
  });
}
// export function useAuthors(search?: string) {
//   // If search is "" or undefined, normalize it to undefined
//   const cleanSearch = search?.trim() || undefined;
//   return useQuery({
//     // If there is no search, the key is just ["authors"]
//     queryKey: cleanSearch ? ["authors", cleanSearch] : ["authors"],
//     queryFn: () => getAuthors(cleanSearch),
//   });
// }
export function useAuthor(id: number) {
  return useQuery({
    queryKey: ["author", id],
    queryFn: () => getAuthor(id),
    enabled: id > 0,
  });
}