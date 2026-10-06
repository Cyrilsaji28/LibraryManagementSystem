export type LoanStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Returned"
  | "Cancelled";

export interface LoanResponseDto {
  id: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  bookId: number;
  bookTitle: string;
  bookCopyId?: number | null;
  requestedAt: string;
  requestedDays: number;
  dueDate?: string | null;
  returnedAt?: string | null;
  status: LoanStatus;
  approvedByLibrarianId?: number | null;
  reviewedAt?: string | null;
  reviewRemarks?: string | null;
  isOverdue: boolean;
}

export interface CreateLoanRequestDto {
  bookId: number;
  bookTitle: string;
  requestedDays: number;
}

export interface ApproveLoanDto {
  bookCopyId?: number | null;
  remarks?: string;
}

export interface RejectLoanDto {
  reason: string;
}
