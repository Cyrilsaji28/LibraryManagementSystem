import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "../api/languageApi";

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: getLanguages,
  });
}