export interface BookSummary {
  id: number;
  title: string;
  subtitle?: string;
  isbn13: string;
  publicationYear: number;
  language: string;
  coverImageUrl?: string;
  totalCopies: number;
  availableCopies: number;
}

export interface AuthorSummary {
  id: number;
  fullName: string;
  biography?: string;
  bookCount: number;
}

export interface AuthorDetails {
  id: number;
  firstName: string;
  lastName: string;
  biography?: string;

  books: BookSummary[];
}