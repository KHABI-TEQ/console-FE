"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Inspection {
  id: string;
  property: {
    id: string;
    title: string;
    location: string;
    type: string;
  };
  buyer: {
    id: string;
    name: string;
    email: string;
  };
  agent: {
    id: string;
    name: string;
    email: string;
  };
  date: string;
  time: string;
  status: string;
  notes?: string;
  created: string;
  updated: string;
}

interface InspectionsContextType {
  inspections: Inspection[];
  selectedInspection: Inspection | null;
  isLoading: boolean;
  filters: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchInspections: (newFilters?: any) => Promise<void>;
  refreshInspections: () => Promise<void>;
  getInspection: (id: string) => Promise<Inspection | null>;
  approveInspection: (id: string) => Promise<void>;
  rejectInspection: (id: string, reason: string) => Promise<void>;
  updateInspectionStatus: (id: string, status: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
  setSelectedInspection: (inspection: Inspection | null) => void;
}

const InspectionsContext = createContext<InspectionsContextType | undefined>(
  undefined,
);

export function InspectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { addNotification } = useApp();

  const fetchInspections = useCallback(
    async (newFilters?: any) => {
      setIsLoading(true);
      try {
        const response = await apiService.getInspections({
          ...filters,
          ...newFilters,
          page: pagination.page,
          limit: pagination.limit,
        });

        if (response.success) {
          setInspections(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch inspections",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch inspections",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit, addNotification],
  );

  const getInspection = useCallback(
    async (id: string): Promise<Inspection | null> => {
      try {
        const response = await apiService.getInspection(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch inspection details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch inspection details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const approveInspection = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.approveInspection(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Inspection approved successfully",
          });
          fetchInspections();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to approve inspection",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to approve inspection",
        });
      }
    },
    [addNotification, fetchInspections],
  );

  const rejectInspection = useCallback(
    async (id: string, reason: string) => {
      try {
        const response = await apiService.rejectInspection(id, reason);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Inspection rejected successfully",
          });
          fetchInspections();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to reject inspection",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to reject inspection",
        });
      }
    },
    [addNotification, fetchInspections],
  );

  const updateInspectionStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const response = await apiService.updateInspectionStatus(id, status);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message:
              response.message || "Inspection status updated successfully",
          });
          fetchInspections();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update inspection status",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update inspection status",
        });
      }
    },
    [addNotification, fetchInspections],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const refreshInspections = useCallback(async () => {
    await fetchInspections();
  }, [fetchInspections]);

  const value: InspectionsContextType = {
    inspections,
    selectedInspection,
    isLoading,
    filters,
    pagination,
    fetchInspections,
    refreshInspections,
    getInspection,
    approveInspection,
    rejectInspection,
    updateInspectionStatus,
    setFilters,
    setPage,
    setSelectedInspection,
  };

  return (
    <InspectionsContext.Provider value={value}>
      {children}
    </InspectionsContext.Provider>
  );
}

export function useInspections() {
  const context = useContext(InspectionsContext);
  if (context === undefined) {
    throw new Error(
      "useInspections must be used within an InspectionsProvider",
    );
  }
  return context;
}
