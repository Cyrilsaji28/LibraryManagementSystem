import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loanService } from "../services/loanService";
import type {
  CreateLoanRequestDto,
  ApproveLoanDto,
  RejectLoanDto,
} from "../types";

export function useMyLoans() {
  return useQuery({
    queryKey: ["my-loans"],
    queryFn: () => loanService.getMyLoans(),
  });
}

export function useAllLoans(status?: string) {
  return useQuery({
    queryKey: ["all-loans", status ?? "All"],
    queryFn: () =>
      loanService.getAllLoans(
        status === "All" || status === "Overdue" ? undefined : status
      ),
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateLoanRequestDto) => loanService.createLoan(dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["book-etag", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useCancelLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loanId: number) => loanService.cancelLoan(loanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
    },
  });
}

export function useApproveLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ApproveLoanDto }) =>
      loanService.approveLoan(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["book-etag"] });
      queryClient.invalidateQueries({ queryKey: ["book"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book-copies"] });
    },
  });
}

export function useRejectLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: RejectLoanDto }) =>
      loanService.rejectLoan(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
    },
  });
}

export function useReturnLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, remarks }: { id: number; remarks?: string }) =>
      loanService.returnLoan(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-loans"] });
      queryClient.invalidateQueries({ queryKey: ["my-loans"] });
      queryClient.invalidateQueries({ queryKey: ["book-etag"] });
      queryClient.invalidateQueries({ queryKey: ["book"] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book-copies"] });
    },
  });
}
