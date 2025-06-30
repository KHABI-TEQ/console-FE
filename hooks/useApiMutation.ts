"use client";
 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRequestLoader } from "@/components/ui/request-loader";
import { useApp } from "@/contexts/AppContext";

interface UseApiMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<{
    success: boolean;
    data?: TData;
    error?: string;
    message?: string;
  }>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: string, variables: TVariables) => void;
  invalidateQueries?: string[];
  successMessage?: string;
  errorMessage?: string;
  showLoader?: boolean;
}

export function useApiMutation<TData = any, TVariables = any>({
  mutationFn,
  onSuccess,
  onError,
  invalidateQueries = [],
  successMessage,
  errorMessage,
  showLoader = true,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { showLoader: displayLoader, hideLoader } = useRequestLoader();
  const { addNotification } = useApp();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      if (showLoader) {
        displayLoader();
      }

      try {
        const response = await mutationFn(variables);

        if (!response.success) {
          throw new Error(response.error || "Operation failed");
        }

        return response;
      } finally {
        if (showLoader) {
          hideLoader();
        }
      }
    },
    onSuccess: (response, variables) => {
      // Invalidate related queries
      invalidateQueries.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });

      // Show success notification
      if (successMessage || response.message) {
        addNotification({
          type: "success",
          title: "Success",
          message:
            successMessage ||
            response.message ||
            "Operation completed successfully",
        });
      }

      // Call custom success handler
      if (onSuccess && response.data) {
        onSuccess(response.data, variables);
      }
    },
    onError: (error: any, variables) => {
      // Show error notification
      const message = error?.message || errorMessage || "An error occurred";
      addNotification({
        type: "error",
        title: "Error",
        message,
      });

      // Call custom error handler
      if (onError) {
        onError(message, variables);
      }
    },
  });
}
