"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { apiService } from "@/lib/services/apiService";
import { useApp } from "./AppContext";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: string;
  tier: string;
  rating: number;
  sales: number;
  commission: number;
  joined: string;
  lastActive: string;
  specialties: string[];
}

interface AgentsContextType {
  agents: Agent[];
  selectedAgent: Agent | null;
  isLoading: boolean;
  filters: any;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  fetchAgents: (newFilters?: any) => Promise<void>;
  refreshAgents: () => Promise<void>;
  getAgent: (id: string) => Promise<Agent | null>;
  getAgentProperties: (agentId: string) => Promise<any[]>;
  deleteAgent: (id: string) => Promise<void>;
  flagAgent: (agentId: string, status: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  // New methods for agent management
  pendingAgents: any[];
  approvedAgents: any[];
  upgradeRequests: any[];
  pendingLoading: boolean;
  approvedLoading: boolean;
  fetchPendingAgents: () => Promise<void>;
  fetchApprovedAgents: (type?: string) => Promise<void>;
  fetchUpgradeRequests: () => Promise<void>;
  approveAgent: (agentId: string, approved: number) => Promise<void>;
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export function AgentsProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  // New state for agent management
  const [pendingAgents, setPendingAgents] = useState<any[]>([]);
  const [approvedAgents, setApprovedAgents] = useState<any[]>([]);
  const [upgradeRequests, setUpgradeRequests] = useState<any[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const { addNotification } = useApp();

  const fetchAgents = useCallback(
    async (newFilters?: any) => {
      setIsLoading(true);
      try {
        const response = await apiService.getAgents({
          ...filters,
          ...newFilters,
          page: pagination.page,
          limit: pagination.limit,
        });

        if (response.success) {
          setAgents(response.data || []);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch agents",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch agents",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [filters, pagination.page, pagination.limit, addNotification],
  );

  const getAgent = useCallback(
    async (id: string): Promise<Agent | null> => {
      try {
        const response = await apiService.getAgent(id);
        if (response.success) {
          return response.data;
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch agent details",
          });
          return null;
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch agent details",
        });
        return null;
      }
    },
    [addNotification],
  );

  const getAgentProperties = useCallback(
    async (agentId: string): Promise<any[]> => {
      try {
        const response = await apiService.getAgentProperties(agentId);
        if (response.success) {
          return response.data || [];
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch agent properties",
          });
          return [];
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch agent properties",
        });
        return [];
      }
    },
    [addNotification],
  );

  const deleteAgent = useCallback(
    async (id: string) => {
      try {
        const response = await apiService.deleteAgent(id);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: response.message || "Agent deleted successfully",
          });
          fetchAgents();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to delete agent",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to delete agent",
        });
      }
    },
    [addNotification, fetchAgents],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const refreshAgents = useCallback(async () => {
    await fetchAgents();
  }, [fetchAgents]);

  const fetchPendingAgents = useCallback(async () => {
    setPendingLoading(true);
    try {
      const response = await apiService.getPendingAgents();
      if (response.success) {
        setPendingAgents(response.users || response.data || []);
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: response.error || "Failed to fetch pending agents",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch pending agents",
      });
    } finally {
      setPendingLoading(false);
    }
  }, [addNotification]);

  const fetchApprovedAgents = useCallback(
    async (type: string = "all") => {
      setApprovedLoading(true);
      try {
        const response = await apiService.getApprovedAgents(type);
        if (response.success) {
          setApprovedAgents(response.users || response.data || []);
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to fetch approved agents",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to fetch approved agents",
        });
      } finally {
        setApprovedLoading(false);
      }
    },
    [addNotification],
  );

  const fetchUpgradeRequests = useCallback(async () => {
    try {
      const response = await apiService.getUpgradeRequests();
      if (response.success) {
        setUpgradeRequests(response.data || []);
      } else {
        addNotification({
          type: "error",
          title: "Error",
          message: response.error || "Failed to fetch upgrade requests",
        });
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch upgrade requests",
      });
    }
  }, [addNotification]);

  const approveAgent = useCallback(
    async (agentId: string, approved: number) => {
      try {
        const response = await apiService.approveAgent(agentId, approved);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message: approved
              ? "Agent approved successfully"
              : "Agent rejected successfully",
          });
          // Refresh data after successful operation
          await Promise.all([fetchPendingAgents(), fetchApprovedAgents()]);
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message: response.error || "Failed to update agent status",
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to update agent status",
        });
      }
    },
    [addNotification, fetchPendingAgents, fetchApprovedAgents],
  );

  const flagAgent = useCallback(
    async (agentId: string, status: string) => {
      try {
        const response = await apiService.flagAgent(agentId, status);
        if (response.success) {
          addNotification({
            type: "success",
            title: "Success",
            message:
              response.message ||
              `Agent ${status === "true" ? "flagged" : "unflagged"} successfully`,
          });
          // Refresh approved agents data after flagging/unflagging
          await fetchApprovedAgents();
        } else {
          addNotification({
            type: "error",
            title: "Error",
            message:
              response.error ||
              `Failed to ${status === "true" ? "flag" : "unflag"} agent`,
          });
        }
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${status === "true" ? "flag" : "unflag"} agent`,
        });
      }
    },
    [addNotification, fetchApprovedAgents],
  );

  const value: AgentsContextType = {
    agents,
    selectedAgent,
    isLoading,
    filters,
    pagination,
    fetchAgents,
    refreshAgents,
    getAgent,
    getAgentProperties,
    deleteAgent,
    flagAgent,
    setFilters,
    setPage,
    setSelectedAgent,
    // New values
    pendingAgents,
    approvedAgents,
    upgradeRequests,
    fetchPendingAgents,
    fetchApprovedAgents,
    fetchUpgradeRequests,
    approveAgent,
  };

  return (
    <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentsContext);
  if (context === undefined) {
    throw new Error("useAgents must be used within an AgentsProvider");
  }
  return context;
}
