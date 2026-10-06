import apiClient from "@/shared/services/apiClient";
import type {
  Book,
  BookDetails,
  BookSearchParams,
  PagedResult,
  CreateBookRequest,
  UpdateBookRequest,
  BookWithEtag,
  BookCopy,
  AddBookCopyRequest,
} from "../types";

export async function getBooks(
  params?: BookSearchParams
): Promise<PagedResult<Book>> {
  const response = await apiClient.get<PagedResult<Book>>("/books", {
    params,
  });

  return response.data;
}

export async function getBookById(id: number): Promise<BookDetails> {
  const response = await apiClient.get<BookDetails>(`/books/${id}`);
  return response.data;

}

export async function getBookByIdWithEtag(id: number): Promise<BookWithEtag> {
  const response = await apiClient.get<BookDetails>(`/books/${id}`);
  const rawEtag = response.headers["etag"] || response.headers["ETag"] || "";
  return {
    book: response.data,
    etag: typeof rawEtag === "string" ? rawEtag : "",
  };
}

export async function createBook(request: CreateBookRequest) {
  const response = await apiClient.post("/books", request);
  return response.data;
}

export async function updateBook(
  id: number,
  request: UpdateBookRequest,
  etag: string
): Promise<void> {
  const cleanEtag =
    etag.startsWith('"') && etag.endsWith('"') ? etag : `"${etag}"`;

  await apiClient.patch(`/books/${id}`, request, {
    headers: {
      "If-Match": cleanEtag,
    },
  });
}

export async function deleteBook(id: number): Promise<void> {
  await apiClient.delete(`/books/${id}`);
}

export async function getBookCopies(bookId: number): Promise<BookCopy[]> {
  const response = await apiClient.get<BookCopy[]>(`/books/${bookId}/copies`);
  return response.data;
}

export async function addBookCopies(
  bookId: number,
  request: AddBookCopyRequest
): Promise<BookCopy[]> {
  const response = await apiClient.post<BookCopy[]>(
    `/books/${bookId}/copies`,
    request
  );
  return response.data;
}

export async function updateBookCopyStatus(
  bookId: number,
  copyId: number,
  status: number
): Promise<void> {
  await apiClient.patch(`/books/${bookId}/copies/${copyId}/status`, {
    status,
  });
}

export async function deleteBookCopy(
  bookId: number,
  copyId: number
): Promise<void> {
  await apiClient.delete(`/books/${bookId}/copies/${copyId}`);
}