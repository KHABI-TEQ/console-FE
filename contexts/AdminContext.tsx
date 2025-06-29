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
  permissions: string[];
  lastLogin: string;
  createdAt: string;
}

interface AdminContextType {
  admins: Admin[];
  selectedAdmin: Admin | null;
  isLoading: boolean;
  fetchAdmins: () => Promise<void>;
  createAdmin: (adminData: any) => Promise<void>;
  updateAdmin: (id: string, adminData: any) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  changeAdminStatus: (id: string, status: string) => Promise<void>;
  getAdmin: (id: string) => Promise<Admin | null>;
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
      const response = await apiService.fetchAdmins();
      setAdmins(response.data || []);
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

  const createAdmin = useCallback(
    async (adminData: any) => {
      try {
        await apiService.createAdmin(adminData);
        addNotification({
          type: "success",
          title: "Success",
          message: "Admin created successfully",
        });
        fetchAdmins();
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to create admin",
        });
      }
    },
    [addNotification, fetchAdmins],
  );

  const updateAdmin = useCallback(
    async (id: string, adminData: any) => {
      try {
        await apiService.updateAdmin(id, adminData);
        addNotification({
          type: "success",
          title: "Success",
          message: "Admin updated successfully",
        });
        fetchAdmins();
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
        await apiService.deleteAdmin(id);
        addNotification({
          type: "success",
          title: "Success",
          message: "Admin deleted successfully",
        });
        fetchAdmins();
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
        await apiService.changeAdminStatus(id, status);
        addNotification({
          type: "success",
          title: "Success",
          message: `Admin status changed to ${status}`,
        });
        fetchAdmins();
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

  const getAdmin = useCallback(
    async (id: string): Promise<Admin | null> => {
      try {
        const response = await apiService.getSingleAdmin(id);
        return response.data;
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

  const value: AdminContextType = {
    admins,
    selectedAdmin,
    isLoading,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    changeAdminStatus,
    getAdmin,
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
