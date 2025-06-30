"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  permissions: string[];
  lastLogin: string;
  created: string;
}

interface AdminContextType {
  admins: Admin[];
  selectedAdmin: Admin | null;
  isLoading: boolean;
  fetchAdmins: () => Promise<void>;
  refreshAdmins: () => Promise<void>;
  getAdmin: (id: string) => Promise<Admin | null>;
  createAdmin: (adminData: any) => Promise<any>;
  updateAdmin: (id: string, adminData: any) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  changeAdminStatus: (id: string, status: string) => Promise<void>;
  setSelectedAdmin: (admin: Admin | null) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useApp();

  const fetchAdmins = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get("/admins");
      if (response.success) {
        setAdmins((response.data as Admin[]) || []);
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: response.error || "Failed to fetch admins",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch admins",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const getAdmin = useCallback(
    async (id: string): Promise<Admin | null> => {
      try {
        const response = await apiService.getAdmin(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch admin details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch admin details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const createAdmin = useCallback(
    async (adminData: any) => {
      try {
        const response = await apiService.post("/create-admin", adminData);

        if (!response.success) {
          throw new Error(response.message || "Failed to create new admin account");
        }

        fetchAdmins();

        return response;
      } catch (error) {
        throw error;
      }
    },
    [addNotification, fetchAdmins],
  );

  const updateAdmin = useCallback(
    async (id: string, adminData: any) => {
      try {
        const response = await apiService.put(`/admin/${id}`, adminData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Admin updated successfully",
          });
          fetchAdmins();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update admin",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update admin",
        });
      }
    },
    [addNotification, fetchAdmins],
  );

  const deleteAdmin = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.delete(`/admin/${id}`);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Admin deleted successfully",
          });
          fetchAdmins();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete admin",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete admin",
        });
      }
    },
    [addNotification, fetchAdmins],
  );

  const changeAdminStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const response = await apiService.patch(`/admin/${id}/status`, {
          status,
        });
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || `Admin status changed to ${status}`,
          });
          fetchAdmins();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to change admin status",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to change admin status",
        });
      }
    },
    [addNotification, fetchAdmins],
  );

  const refreshAdmins = useCallback(async () => {
    await fetchAdmins();
  }, [fetchAdmins]);

  const value: AdminContextType = {
    admins,
    selectedAdmin,
    isLoading,
    fetchAdmins,
    refreshAdmins,
    getAdmin,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changeAdminStatus,
    setSelectedAdmin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
