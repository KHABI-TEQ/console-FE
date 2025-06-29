"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  status: string;
  featured: boolean;
  images: string[];
  agent: string;
  listed: string;
  views: number;
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
  getProperty: (id: string) => Promise<Property | null>;
  createProperty: (propertyData: any) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  approveDisapproveProperty: (id: string, status: string) => Promise<void>;
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
        const response = await apiService.getProperties({
          ...filters,
          ...newFilters,
          page: pagination.page,
          limit: pagination.limit,
        });

        setProperties(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
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
    [filters, pagination.page, pagination.limit, addNotification],
  );

  const getProperty = useCallback(
    async (id: string): Promise<Property | null> => {
      try {
        const response = await apiService.getProperty(id);
        return response.data;
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
        await apiService.createProperty(propertyData);
        addNotification({
          type: "success",
          title: "Success",
          message: "Property created successfully",
        });
        fetchProperties();
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

  const deleteProperty = useCallback(
    async (id: string) => {
      try {
        await apiService.deleteProperty(id);
        addNotification({
          type: "success",
          title: "Success",
          message: "Property deleted successfully",
        });
        fetchProperties();
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

  const approveDisapproveProperty = useCallback(
    async (id: string, status: string) => {
      try {
        await apiService.approveDisapproveProperty(id, status);
        addNotification({
          type: "success",
          title: "Success",
          message: `Property ${status} successfully`,
        });
        fetchProperties();
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${status} property`,
        });
      }
    },
    [addNotification, fetchProperties],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const value: PropertiesContextType = {
    properties,
    selectedProperty,
    isLoading,
    filters,
    pagination,
    fetchProperties,
    getProperty,
    createProperty,
    deleteProperty,
    approveDisapproveProperty,
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
