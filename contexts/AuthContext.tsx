"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiService } from "@/lib/services/apiService";
import { useRouter } from "next/navigation";
import { useApp } from "./AppContext";

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
  login: (email: string, password: string, response?: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addNotification } = useApp();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));

      if (!authToken) {
        console.warn("No auth token found");
        return;
      }

      const response = await apiService.getProfile();

      if (response.success) {
        const userData =
          response.data?.user || response.admin?.admin || response.admin;

        setUser({
          id: userData.id || userData._id || "admin-1",
          name:
            userData.name ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Admin User",
          email: userData.email || "admin@example.com",
          role: userData.role || "admin",
          avatar: userData.avatar || "/placeholder.svg",
          firstName: userData.firstName,
          lastName: userData.lastName,
        });
      } else {
        console.error(
          "Profile fetch failed:",
          response.error || response.message,
        );
        document.cookie = "auth-token=; path=/; max-age=0";
        // Optionally setUser(null) or redirect to login
      }
    } catch (error) {
      console.error("Unexpected auth check failure:", error);
      document.cookie = "auth-token=; path=/; max-age=0";
      // Optionally setUser(null) or redirect
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    try {
      setIsLoading(true);

      const response = await apiService.login({ email, password });

      if (!response.success) {
        throw new Error(response.message || "Login failed");
      }

      const token =
        response.admin?.token ||
        response.admin?.accessToken ||
        response.token ||
        response.accessToken;

      if (token) {
        document.cookie = `auth-token=${token}; path=/; max-age=86400; secure; samesite=strict`;
      }

      const userData =
        response.data?.user || response.admin?.admin || response.admin;

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

      router.push("/dashboard");

      addNotification({
        type: "success",
        title: "Welcome back!",
        message: "You have successfully signed in to your account.",
      });

      return response; // ✅ allow consumer to use response
    } catch (error) {
      addNotification({
        type: "error",
        title: "Login failed",
        message: error instanceof Error ? error.message : "Unexpected error occurred",
      });

      throw error; // ✅ allow mutation to catch it
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
