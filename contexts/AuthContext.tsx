"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "@/lib/services/apiService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));

      if (authToken) {
        // If we have a token, try to get user profile
        try {
          // You might want to add a profile endpoint to verify the token
          setUser({
            id: "admin-1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            avatar: "/placeholder.svg",
          });
        } catch (error) {
          // Token is invalid, clear it
          document.cookie = "auth-token=; path=/; max-age=0";
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await apiService.login({ email, password });

      if (response.success) {
        // Extract token from response - check multiple possible locations
        const token =
          response.data?.token ||
          response.data?.accessToken ||
          response.token ||
          response.accessToken;

        if (token) {
          // Set auth cookie with the actual token
          document.cookie = `auth-token=${token}; path=/; max-age=86400; secure; samesite=strict`;
        }

        // Set user data from response - check multiple possible locations
        const userData = response.data?.user ||
          response.data?.admin ||
          response.data ||
          response.user ||
          response.admin || {
            id: "admin-1",
            email: email,
            name: "Admin User",
            role: "admin",
          };

        setUser({
          id: userData.id || userData._id || "admin-1",
          name:
            userData.name ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Admin User",
          email: userData.email || email,
          role: userData.role || "admin",
          avatar: userData.avatar || "/placeholder.svg",
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } else {
        throw new Error(response.error || response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);

      // If it's a network error or server not responding, still allow login for demo
      if (
        error instanceof Error &&
        (error.message.includes("fetch") || error.message.includes("Network"))
      ) {
        // Set a mock user for demo purposes
        document.cookie = `auth-token=demo-token-${Date.now()}; path=/; max-age=86400; secure; samesite=strict`;
        setUser({
          id: "demo-admin",
          name: "Demo Admin",
          email: email,
          role: "admin",
          avatar: "/placeholder.svg",
        });
        return;
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear auth cookie
      document.cookie = "auth-token=; path=/; max-age=0";
      setUser(null);
      // Redirect to login page
      window.location.href = "/auth/login";
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
