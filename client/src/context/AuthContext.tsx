import { createContext, useContext, useState } from "react";

type User = {
  id: number;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null"),
  );

  const login = (userData: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit etre utilisé dans AuthProvider");
  return context;
};
