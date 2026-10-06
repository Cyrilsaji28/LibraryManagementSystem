import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/apiClient";

export interface Category {
  id: number;
  name: string;
}

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<Category[]>("/Categories");

      return response.data;
    },
  });
}