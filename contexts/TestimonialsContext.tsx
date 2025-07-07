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
  createTestimonial: (data: CreateTestimonialPayload) => Promise<void>;
  updateTestimonial: (
    id: string,
    data: UpdateTestimonialPayload,
  ) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  updateTestimonialStatus: (
    id: string,
    status: "approved" | "rejected",
  ) => Promise<void>;
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
          setTestimonials(response.testimonials || response.data || []);
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
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: "Testimonial created successfully",
          });
          fetchTestimonials();
        } else {
          // Check if it's an endpoint not found error
          if (
            response.error?.includes("404") ||
            response.error?.includes("Not Found")
          ) {
            addNotification({
              type: "warning",
              title: "Feature Not Available",
              message:
                "Testimonials API endpoint is not yet implemented on the backend",
            });
          } else {
            addNotification({
              type: "error",
              title: "Error",
              message: response.error || "Failed to create testimonial",
            });
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        if (errorMessage.includes("fetch") || errorMessage.includes("404")) {
          addNotification({
            type: "warning",
            title: "Feature Not Available",
            message:
              "Testimonials API endpoint is not yet implemented on the backend",
          });
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: "Failed to create testimonial",
          });
        }
      }
    },
    [addNotification, fetchTestimonials],
  );

  const updateTestimonial = useCallback(
    async (id: string, data: UpdateTestimonialPayload) => {
      try {
        const response = await apiService.updateTestimonial(id, data);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: "Testimonial updated successfully",
          });
          fetchTestimonials();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update testimonial",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update testimonial",
        });
      }
    },
    [addNotification, fetchTestimonials],
  );

  const deleteTestimonial = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteTestimonial(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Testimonial deleted successfully",
          });
          fetchTestimonials();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete testimonial",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete testimonial",
        });
      }
    },
    [addNotification, fetchTestimonials],
  );

  const updateTestimonialStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      try {
        const response = await apiService.updateTestimonialStatus(id, status);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: `Testimonial ${status} successfully`,
          });
          fetchTestimonials();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message:
              response.error ||
              `Failed to ${status === "approved" ? "approve" : "reject"} testimonial`,
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${status === "approved" ? "approve" : "reject"} testimonial`,
        });
      }
    },
    [addNotification, fetchTestimonials],
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
