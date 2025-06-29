import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "@/contexts/AppContext";
import { apiService, ApiResponse } from "@/lib/services/apiService";

export function useApiQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: any,
) {
  const { addNotification } = useApp();

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await queryFn();
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Data Loading Error",
            message: response.error || "Failed to load data",
          });
          throw new Error(response.error || "Failed to load data");
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Data Loading Error",
          message:
            error instanceof Error ? error.message : "Failed to load data",
        });
        throw error;
      }
    },
    ...options,
  });
}

export function useApiMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T, variables: V) => void;
    onError?: (error: Error, variables: V) => void;
    invalidateQueries?: string[][];
  },
) {
  const { addNotification } = useApp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: V) => {
      try {
        const response = await mutationFn(variables);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables);
      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      addNotification({
        type: "success",
        title: "Success",
        message: "Operation completed successfully",
      });
    },
    onError: (error, variables) => {
      options?.onError?.(error as Error, variables);
      addNotification({
        type: "error",
        title: "Operation Failed",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    },
  });
}

// Specific hooks for common operations
export function useInspections(filters?: any) {
  return useApiQuery(["inspections", filters], () =>
    apiService.getInspections(filters),
  );
}

export function useProperties(filters?: any) {
  return useApiQuery(["properties", filters], () =>
    apiService.getProperties(filters),
  );
}

export function useAgents(filters?: any) {
  return useApiQuery(["agents", filters], () => apiService.getAgents(filters));
}

export function useBuyers(filters?: any) {
  return useApiQuery(["buyers", filters], () => apiService.getBuyers(filters));
}

export function useBriefs(filters?: any) {
  return useApiQuery(["briefs", filters], () => apiService.getBriefs(filters));
}

export function useContacts(filters?: any) {
  return useApiQuery(["contacts", filters], () =>
    apiService.getContacts(filters),
  );
}
