"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: string;
  tier: string;
  rating: number;
  properties: number;
  totalRevenue: number;
  joined: string;
  lastActive: string;
  specialties: string[];
  verificationStatus: string;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    verified: boolean;
  };
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
  verifyLandlord: (id: string, status: string) => Promise<void>;
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
        // This would be a specific landlord endpoint
        const response = await apiService.get("/landlords", {
          ...filters,
          ...newFilters,
          page: pagination.page,
          limit: pagination.limit,
        });

        setLandlords(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
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
        const response = await apiService.get(`/landlords/${id}`);
        return response.data;
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
        await apiService.post("/landlords", landlordData);
        addNotification({
          type: "success",
          title: "Success",
          message: "Landlord created successfully",
        });
        fetchLandlords();
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
        await apiService.put(`/landlords/${id}`, landlordData);
        addNotification({
          type: "success",
          title: "Success",
          message: "Landlord updated successfully",
        });
        fetchLandlords();
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
        await apiService.delete(`/landlords/${id}`);
        addNotification({
          type: "success",
          title: "Success",
          message: "Landlord deleted successfully",
        });
        fetchLandlords();
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

  const verifyLandlord = useCallback(
    async (id: string, status: string) => {
      try {
        await apiService.patch(`/landlords/${id}/verify`, { status });
        addNotification({
          type: "success",
          title: "Success",
          message: `Landlord ${status} successfully`,
        });
        fetchLandlords();
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${status} landlord`,
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
    verifyLandlord,
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
