"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  properties: number;
  totalValue: number;
  monthlyRevenue: number;
  avatar: string;
  status: string;
  joined: string;
  lastActive: string;
  location: string;
}

interface LandlordsContextType {
  landlords: Landlord[];
  selectedLandlord: Landlord | null;
  isLoading: boolean;
  filters: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchLandlords: (newFilters?: any) => Promise<void>;
  refreshLandlords: () => Promise<void>;
  getLandlord: (id: string) => Promise<Landlord | null>;
  createLandlord: (landlordData: any) => Promise<void>;
  updateLandlord: (id: string, landlordData: any) => Promise<void>;
  deleteLandlord: (id: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
  setSelectedLandlord: (landlord: Landlord | null) => void;
}

const LandlordsContext = createContext<LandlordsContextType | undefined>(
  undefined,
);

export function LandlordsProvider({ children }: { children: React.ReactNode }) {
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [selectedLandlord, setSelectedLandlord] = useState<Landlord | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { addNotification } = useApp();

  const fetchLandlords = useCallback(
    async (newFilters?: any) => {
      setIsLoading(true);
      try {
        const response = await apiService.getLandowners({
          ...filters,
          ...newFilters,
          page: pagination.page,
          limit: pagination.limit,
        });

        if (response.success) {
          setLandlords(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch landlords",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch landlords",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit, addNotification],
  );

  const getLandlord = useCallback(
    async (id: string): Promise<Landlord | null> => {
      try {
        const response = await apiService.getLandowner(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch landlord details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch landlord details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const createLandlord = useCallback(
    async (landlordData: any) => {
      try {
        const response = await apiService.createLandowner(landlordData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Landlord created successfully",
          });
          fetchLandlords();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to create landlord",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to create landlord",
        });
      }
    },
    [addNotification, fetchLandlords],
  );

  const updateLandlord = useCallback(
    async (id: string, landlordData: any) => {
      try {
        const response = await apiService.updateLandowner(id, landlordData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Landlord updated successfully",
          });
          fetchLandlords();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update landlord",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update landlord",
        });
      }
    },
    [addNotification, fetchLandlords],
  );

  const deleteLandlord = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteLandowner(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Landlord deleted successfully",
          });
          fetchLandlords();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete landlord",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete landlord",
        });
      }
    },
    [addNotification, fetchLandlords],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const refreshLandlords = useCallback(async () => {
    await fetchLandlords();
  }, [fetchLandlords]);

  const value: LandlordsContextType = {
    landlords,
    selectedLandlord,
    isLoading,
    filters,
    pagination,
    fetchLandlords,
    refreshLandlords,
    getLandlord,
    createLandlord,
    updateLandlord,
    deleteLandlord,
    setFilters,
    setPage,
    setSelectedLandlord,
  };

  return (
    <LandlordsContext.Provider value={value}>
      {children}
    </LandlordsContext.Provider>
  );
}

export function useLandlords() {
  const context = useContext(LandlordsContext);
  if (context === undefined) {
    throw new Error("useLandlords must be used within a LandlordsProvider");
  }
  return context;
}
