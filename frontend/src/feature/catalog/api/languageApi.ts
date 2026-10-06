import apiClient from "@/shared/services/apiClient";

export interface Language {
  id: number;
  name: string;
}

export async function getLanguages(): Promise<Language[]> {
  const response = await apiClient.get<Language[]>("/languages");

  return response.data;
}