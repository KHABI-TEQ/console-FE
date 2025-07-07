"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";
import type {
  Testimonial,
  CreateTestimonialPayload,
  UpdateTestimonialPayload,
  TestimonialsFilters,
} from "@/lib/types/testimonial";

interface TestimonialsContextType {
  testimonials: Testimonial[];
  selectedTestimonial: Testimonial | null;
  isLoading: boolean;
  filters: TestimonialsFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchTestimonials: (newFilters?: TestimonialsFilters) => Promise<void>;
  refreshTestimonials: () => Promise<void>;
  getTestimonial: (id: string) => Promise<Testimonial | null>;
  createTestimonial: (data: CreateTestimonialPayload) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }>;
  updateTestimonial: (
    id: string,
    data: UpdateTestimonialPayload,
  ) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }>;
  deleteTestimonial: (id: string) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }>;
  updateTestimonialStatus: (
    id: string,
    status: "approved" | "rejected",
  ) => Promise<{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  }>;
  setFilters: (filters: TestimonialsFilters) => void;
  setPage: (page: number) => void;
  setSelectedTestimonial: (testimonial: Testimonial | null) => void;
}

const TestimonialsContext = createContext<TestimonialsContextType | undefined>(
  undefined,
);

export function TestimonialsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<TestimonialsFilters>({
    page: 1,
    limit: 10,
    search: "",
    status: "all",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const { addNotification } = useApp();

  const fetchTestimonials = useCallback(
    async (newFilters?: TestimonialsFilters) => {
      setIsLoading(true);
      try {
        const mergedFilters = { ...filters, ...newFilters };
        const response = await apiService.getTestimonials(mergedFilters);

        if (response.success) {
          setTestimonials(
            (response as any).testimonials || response.data || [],
          );
          if (response.pagination) {
            setPagination({
              page: response.pagination.page,
              limit: response.pagination.limit,
              total: response.pagination.total,
              totalPages:
                response.pagination.totalPages ||
                Math.ceil(
                  response.pagination.total / response.pagination.limit,
                ),
            });
          }
        } else {
          // Set empty testimonials to prevent errors
          setTestimonials([]);
          setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });

          // Only show error notification if it's not a 404 (endpoint not found)
          if (
            !response.error?.includes("404") &&
            !response.error?.includes("Not Found")
          ) {
            addNotification({
              type: "error",
              title: "Error",
              message: response.error || "Failed to fetch testimonials",
            });
          }
        }
      } catch (error) {
        // Set empty testimonials to prevent errors
        setTestimonials([]);
        setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });

        // Only show error notification for non-network errors
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (!errorMessage.includes("fetch") && !errorMessage.includes("404")) {
          addNotification({
            type: "error",
            title: "Error",
            message: "Failed to fetch testimonials",
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [filters, addNotification],
  );

  const getTestimonial = useCallback(
    async (id: string): Promise<Testimonial | null> => {
      try {
        const response = await apiService.getTestimonial(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch testimonial details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch testimonial details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const createTestimonial = useCallback(
    async (data: CreateTestimonialPayload) => {
      try {
        const response = await apiService.createTestimonial(data);

        // Ensure response has the expected structure
        const normalizedResponse = {
          success: response?.success ?? false,
          data: response?.data,
          error: response?.error,
          message: response?.message,
        };

        if (normalizedResponse.success) {
          await fetchTestimonials();
          return normalizedResponse;
        } else {
          // Check if it's an endpoint not found error
          if (
            normalizedResponse.error?.includes("404") ||
            normalizedResponse.error?.includes("Not Found")
          ) {
            throw new Error(
              "Testimonials API endpoint is not yet implemented on the backend",
            );
          } else {
            throw new Error(
              normalizedResponse.error || "Failed to create testimonial",
            );
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes("fetch") || errorMessage.includes("404")) {
          throw new Error(
            "Testimonials API endpoint is not yet implemented on the backend",
          );
        } else {
          throw new Error(errorMessage);
        }
      }
    },
    [fetchTestimonials],
  );

  const updateTestimonial = useCallback(
    async (id: string, data: UpdateTestimonialPayload) => {
      try {
        const response = await apiService.updateTestimonial(id, data);

        // Ensure response has the expected structure
        const normalizedResponse = {
          success: response?.success ?? false,
          data: response?.data,
          error: response?.error,
          message: response?.message,
        };

        if (normalizedResponse.success) {
          await fetchTestimonials();
          return normalizedResponse;
        } else {
          throw new Error(
            normalizedResponse.error || "Failed to update testimonial",
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
      }
    },
    [fetchTestimonials],
  );

  const deleteTestimonial = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteTestimonial(id);

        // Ensure response has the expected structure
        const normalizedResponse = {
          success: response?.success ?? false,
          data: response?.data,
          error: response?.error,
          message: response?.message,
        };

        if (normalizedResponse.success) {
          await fetchTestimonials();
          return normalizedResponse;
        } else {
          throw new Error(
            normalizedResponse.error || "Failed to delete testimonial",
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
      }
    },
    [fetchTestimonials],
  );

  const updateTestimonialStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      try {
        const response = await apiService.updateTestimonialStatus(id, status);

        // Ensure response has the expected structure
        const normalizedResponse = {
          success: response?.success ?? false,
          data: response?.data,
          error: response?.error,
          message: response?.message,
        };

        if (normalizedResponse.success) {
          await fetchTestimonials();
          return normalizedResponse;
        } else {
          throw new Error(
            normalizedResponse.error ||
              `Failed to ${status === "approved" ? "approve" : "reject"} testimonial`,
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage);
      }
    },
    [fetchTestimonials],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const refreshTestimonials = useCallback(async () => {
    await fetchTestimonials();
  }, [fetchTestimonials]);

  const value: TestimonialsContextType = {
    testimonials,
    selectedTestimonial,
    isLoading,
    filters,
    pagination,
    fetchTestimonials,
    refreshTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateTestimonialStatus,
    setFilters,
    setPage,
    setSelectedTestimonial,
  };

  return (
    <TestimonialsContext.Provider value={value}>
      {children}
    </TestimonialsContext.Provider>
  );
}

export function useTestimonials() {
  const context = useContext(TestimonialsContext);
  if (context === undefined) {
    throw new Error(
      "useTestimonials must be used within a TestimonialsProvider",
    );
  }
  return context;
}
