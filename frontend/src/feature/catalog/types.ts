
export interface Book {
  id: number;
  title: string;
  subtitle: string;
  isbn13: string;
  publicationYear: number;
  language: string;
  coverImageUrl: string;
  totalCopies: number;
  availableCopies: number;
}
export type BookDetails = {
  id: number;
  title: string;
  subtitle?: string;
  isbN10?: string;
  isbN13?: string;
  edition?: string;
  publicationYear: number;
  language: string;
  summary?: string;
  coverImageUrl?: string;

 authors: {
  id: number;
  name: string;
}[];
  categories: string[];

  totalCopies: number;
  availableCopies: number;
  onLoanCopies: number;
  overdueCopies: number;
};

export interface PagedResult<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface BookSearchParams {
  Q?: string;
  ISBN?: string;
  Author?: string;
  Category?: string;
  Language?: string;
  AvailableOnly?: boolean;
  Page?: number;
  Size?: number;
  SortBy?: string;
  Descending?: boolean;
}

export interface BookWithEtag {
  book: BookDetails;
  etag: string;
}

export interface CreateBookRequest {
  title: string;
  subtitle?: string;
  isbn10?: string;
  isbn13: string;
  edition?: string;
  publicationYear: number;
  languageId: number;
  summary?: string;
  coverImageUrl: string;
  authorIds: number[];
  categoryIds: number[];
  totalCopies: number;
}

export interface UpdateBookRequest {
  title: string;
  subtitle?: string;
  isbn10?: string;
  isbn13: string;
  edition?: string;
  publicationYear: number;
  languageId: number;
  summary?: string;
  coverImageUrl?: string;
  authorIds: number[];
  categoryIds: number[];
}

export interface BookCopy {
  id: number;
  barcode: string;
  status: number; // 0 = Available, 1 = OnLoan, 2 = Overdue
  statusName: string;
  bookId: number;
}

export interface AddBookCopyRequest {
  customBarcode?: string;
  count: number;
  status?: number;
}

export interface UpdateBookCopyStatusRequest {
  status: number;
}