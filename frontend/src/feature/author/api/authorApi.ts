import apiClient from "@/shared/services/apiClient";
import type { AuthorDetails, AuthorSummary } from "@/feature/author/types";

export async function getAuthors(search?: string): Promise<AuthorSummary[]> {
  const response = await apiClient.get<AuthorSummary[]>("/authors", {
    params: search ? { search } : undefined,
  });
  return response.data;
}

export async function getAuthor(id: number): Promise<AuthorDetails> {
  const response = await apiClient.get<AuthorDetails>(`/authors/${id}`);
  return response.data;
}