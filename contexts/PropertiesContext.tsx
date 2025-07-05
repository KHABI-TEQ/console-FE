"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  status: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  agent: {
    id: string;
    name: string;
    avatar: string;
  };
  listed: string;
  updated: string;
  description: string;
  features: string[];
}

interface PropertiesContextType {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  filters: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchProperties: (newFilters?: any) => Promise<void>;
  refreshProperties: () => Promise<void>;
  getProperty: (id: string) => Promise<Property | null>;
  createProperty: (propertyData: any) => Promise<void>;
  updateProperty: (id: string, propertyData: any) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  approveProperty: (id: string) => Promise<void>;
  rejectProperty: (id: string, reason?: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
  setSelectedProperty: (property: Property | null) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(
  undefined,
);

export function PropertiesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
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

  const fetchProperties = useCallback(
    async (newFilters?: any) => {
      setIsLoading(true);
      try {
        const currentPage =
          newFilters?.page !== undefined ? newFilters.page : pagination.page;
        const mergedFilters = {
          ...filters,
          ...newFilters,
          page: currentPage,
          limit: pagination.limit,
        };

        // Use submitted briefs endpoint if userType is specified
        const response = mergedFilters.userType
          ? await apiService.getSubmittedBriefs(mergedFilters)
          : await apiService.getProperties(mergedFilters);

        if (response.success) {
          setProperties(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination as any);
          } else if (response.total !== undefined) {
            setPagination((prev) => ({
              ...prev,
              total: response.total || 0,
              totalPages: Math.ceil((response.total || 0) / pagination.limit),
            }));
          }
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch properties",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch properties",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.limit, addNotification],
  );

  const getProperty = useCallback(
    async (id: string): Promise<Property | null> => {
      try {
        const response = await apiService.getProperty(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch property details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch property details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const createProperty = useCallback(
    async (propertyData: any) => {
      try {
        const response = await apiService.createProperty(propertyData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Property created successfully",
          });
          fetchProperties();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to create property",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to create property",
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const updateProperty = useCallback(
    async (id: string, propertyData: any) => {
      try {
        const response = await apiService.updateProperty(id, propertyData);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Property updated successfully",
          });
          fetchProperties();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update property",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update property",
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const deleteProperty = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteProperty(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Property deleted successfully",
          });
          fetchProperties();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete property",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete property",
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const approveProperty = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.approveProperty(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Property approved successfully",
          });
          fetchProperties();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to approve property",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to approve property",
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const rejectProperty = useCallback(
    async (id: string, reason?: string) => {
      try {
        const response = await apiService.rejectProperty(id, reason);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Property rejected successfully",
          });
          fetchProperties();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to reject property",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to reject property",
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const setPage = useCallback(
    (page: number) => {
      setPagination((prev) => ({ ...prev, page }));
      fetchProperties({ page });
    },
    [fetchProperties],
  );

  const refreshProperties = useCallback(async () => {
    await fetchProperties();
  }, [fetchProperties]);

  const value: PropertiesContextType = {
    properties,
    selectedProperty,
    isLoading,
    filters,
    pagination,
    fetchProperties,
    refreshProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    approveProperty,
    rejectProperty,
    setFilters,
    setPage,
    setSelectedProperty,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
}
