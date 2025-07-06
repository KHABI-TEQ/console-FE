"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Buyer {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  isAccountVerified: boolean;
  isInActive: boolean;
  isPremium: boolean;
  isFlagged: boolean;
  createdAt: string;
  userType?: string;
  accountId?: string;
  _id?: string;
}

interface BuyersContextType {
  buyers: Buyer[];
  isLoading: boolean;
  filters: any;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  fetchBuyers: (newFilters?: any) => Promise<void>;
  refreshBuyers: () => Promise<void>;
  getBuyer: (id: string) => Promise<Buyer | null>;
  createBuyer: (buyerData: any) => Promise<void>;
  updateBuyer: (id: string, buyerData: any) => Promise<void>;
  deleteBuyer: (id: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
}

const BuyersContext = createContext<BuyersContextType | undefined>(undefined);

export function BuyersProvider({ children }: { children: React.ReactNode }) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  });
  const { addNotification } = useApp();

  const fetchBuyers = useCallback(
    async (newFilters?: any) => {
      setIsLoading(true);
      try {
        const currentPage =
          newFilters?.page !== undefined
            ? newFilters.page
            : pagination.currentPage;
        const mergedFilters = {
          ...filters,
          ...newFilters,
          page: currentPage,
          limit: pagination.perPage,
        };

        const response = await apiService.getBuyers(mergedFilters);

        if (response.success) {
          setBuyers(response.data || []);
          if (response.pagination) {
            setPagination({
              currentPage:
                (response.pagination as any).currentPage ||
                (response.pagination as any).page ||
                1,
              perPage:
                (response.pagination as any).perPage ||
                (response.pagination as any).limit ||
                20,
              total: response.pagination.total || 0,
              totalPages:
                response.pagination.totalPages ||
                Math.ceil(
                  (response.pagination.total || 0) /
                    ((response.pagination as any).perPage ||
                      (response.pagination as any).limit ||
                      20),
                ),
            });
          } else if (response.total !== undefined) {
            setPagination((prev) => ({
              ...prev,
              total: response.total || 0,
              totalPages: Math.ceil((response.total || 0) / prev.perPage),
            }));
          }
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch buyers",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch buyers",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pagination.currentPage, pagination.perPage, addNotification],
  );

  const getBuyer = useCallback(
    async (id: string): Promise<Buyer | null> => {
      try {
        const response = await apiService.getBuyer(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch buyer details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch buyer details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const createBuyer = useCallback(
    async (buyerData: any) => {
      try {
        const response = await apiService.createBuyer(buyerData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Buyer created successfully",
          });
          fetchBuyers();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to create buyer",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to create buyer",
        });
      }
    },
    [addNotification, fetchBuyers],
  );

  const updateBuyer = useCallback(
    async (id: string, buyerData: any) => {
      try {
        const response = await apiService.updateBuyer(id, buyerData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Buyer updated successfully",
          });
          fetchBuyers();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update buyer",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update buyer",
        });
      }
    },
    [addNotification, fetchBuyers],
  );

  const deleteBuyer = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteBuyer(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Buyer deleted successfully",
          });
          fetchBuyers();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete buyer",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete buyer",
        });
      }
    },
    [addNotification, fetchBuyers],
  );

  const setPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, currentPage: page }));
      const mergedFilters = { ...filters, page };
      fetchBuyers(mergedFilters);
    },
    [filters, fetchBuyers],
  );

  const refreshBuyers = useCallback(async () => {
    await fetchBuyers();
  }, [fetchBuyers]);

  const setFiltersCallback = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const value: BuyersContextType = {
    buyers,
    isLoading,
    filters,
    pagination,
    fetchBuyers,
    refreshBuyers,
    getBuyer,
    createBuyer,
    updateBuyer,
    deleteBuyer,
    setFilters: setFiltersCallback,
    setPage,
  };

  return (
    <BuyersContext.Provider value={value}>{children}</BuyersContext.Provider>
  );
}

export function useBuyers() {
  const context = useContext(BuyersContext);
  if (context === undefined) {
    throw new Error("useBuyers must be used within a BuyersProvider");
  }
  return context;
}
