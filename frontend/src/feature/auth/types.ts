export type UserRole =
  | "Member"
  | "Librarian"
  | "Admin";

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}

export interface AuthUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
}