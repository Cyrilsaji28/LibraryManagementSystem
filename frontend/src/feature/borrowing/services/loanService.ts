import apiClient from "@/shared/services/apiClient";
import type {
  LoanResponseDto,
  CreateLoanRequestDto,
  ApproveLoanDto,
  RejectLoanDto,
} from "../types";

export const loanService = {
  async createLoan(dto: CreateLoanRequestDto): Promise<LoanResponseDto> {
    const response = await apiClient.post<LoanResponseDto>("/loans", dto);
    return response.data;
  },

  async getMyLoans(): Promise<LoanResponseDto[]> {
    const response = await apiClient.get<LoanResponseDto[]>("/loans/my-loans");
    return response.data;
  },

  async getAllLoans(status?: string): Promise<LoanResponseDto[]> {
    const params = status ? { status } : {};
    const response = await apiClient.get<LoanResponseDto[]>("/loans", { params });
    return response.data;
  },

  async getLoanById(id: number): Promise<LoanResponseDto> {
    const response = await apiClient.get<LoanResponseDto>(`/loans/${id}`);
    return response.data;
  },

  async cancelLoan(id: number): Promise<LoanResponseDto> {
    const response = await apiClient.delete<LoanResponseDto>(`/loans/${id}/cancel`);
    return response.data;
  },

  async approveLoan(id: number, dto: ApproveLoanDto): Promise<LoanResponseDto> {
    const response = await apiClient.put<LoanResponseDto>(`/loans/${id}/approve`, dto);
    return response.data;
  },

  async rejectLoan(id: number, dto: RejectLoanDto): Promise<LoanResponseDto> {
    const response = await apiClient.put<LoanResponseDto>(`/loans/${id}/reject`, dto);
    return response.data;
  },

  async returnLoan(id: number, remarks?: string): Promise<LoanResponseDto> {
    const response = await apiClient.put<LoanResponseDto>(
      `/loans/${id}/return`,
      remarks ? JSON.stringify(remarks) : null,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  },
};
