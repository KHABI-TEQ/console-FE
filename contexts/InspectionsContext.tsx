"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Inspection {
  _id: string;
  propertyId: any;
  requestedBy: any;
  owner: any;
  status: string;
  stage: string;
  inspectionDate: string;
  inspectionTime: string;
  isNegotiating: boolean;
  negotiationPrice: number;
  pendingResponseFrom: string;
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
  getInspection: (id: string) => Promise<Inspection | null>;
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

        setInspections(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
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
        return response.data;
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

  const updateInspectionStatus = useCallback(
    async (id: string, status: string) => {
      try {
        await apiService.updateInspectionStatus(id, status);
        addNotification({
          type: "success",
          title: "Success",
          message: "Inspection status updated successfully",
        });
        fetchInspections();
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

  const value: InspectionsContextType = {
    inspections,
    selectedInspection,
    isLoading,
    filters,
    pagination,
    fetchInspections,
    getInspection,
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
