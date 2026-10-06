import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
} from "../api/authApi";

import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "../types";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (
    request: LoginRequest
  ) => Promise<void>;

  register: (
    request: RegisterRequest
  ) => Promise<void>;

  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

const TOKEN_KEY = "library_auth_token";
const USER_KEY = "library_auth_user";

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [token, setToken] =
    useState<string | null>(() => {
      return localStorage.getItem(TOKEN_KEY);
    });

  const [user, setUser] =
    useState<AuthUser | null>(() => {
      const storedUser =
        localStorage.getItem(USER_KEY);

      if (!storedUser) {
        return null;
      }

      try {
        return JSON.parse(
          storedUser
        ) as AuthUser;
      } catch {
        localStorage.removeItem(USER_KEY);

        return null;
      }
    });

  async function login(
    request: LoginRequest
  ) {
    const response: AuthResponse =
      await loginApi(request);

    const authUser: AuthUser = {
      userId: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      role: response.role,
    };

    setToken(response.token);

    setUser(authUser);

    localStorage.setItem(
      TOKEN_KEY,
      response.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authUser)
    );
  }

  async function register(
    request: RegisterRequest
  ) {
    const response: AuthResponse =
      await registerApi(request);

    const authUser: AuthUser = {
      userId: response.userId,
      firstName: response.firstName,
      lastName: response.lastName,
      email: response.email,
      role: response.role,
    };

    setToken(response.token);

    setUser(authUser);

    localStorage.setItem(
      TOKEN_KEY,
      response.token
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(authUser)
    );
  }

  function logout() {
    setToken(null);

    setUser(null);

    localStorage.removeItem(TOKEN_KEY);

    localStorage.removeItem(USER_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}