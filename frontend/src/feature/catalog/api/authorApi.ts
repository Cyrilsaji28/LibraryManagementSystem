import apiClient from "@/shared/services/apiClient";

export interface Author {
  id: number;
  fullName: string;
}

export async function getAuthors(
  search?: string
): Promise<Author[]> {
  const response = await apiClient.get<Author[]>(
    "/authors",
    {
      params: {
        search,
      },
    }
  );

  return response.data;
}