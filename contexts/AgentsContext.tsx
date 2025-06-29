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
  getAgent: (id: string) => Promise<Agent | null>;
  getAgentProperties: (agentId: string) => Promise<any[]>;
  deleteAgent: (id: string) => Promise<void>;
  flagAgent: (agentId: string, status: string) => Promise<void>;
  setFilters: (filters: any) => void;
  setPage: (page: number) => void;
  setSelectedAgent: (agent: Agent | null) => void;
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

        setAgents(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
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
        return response.data;
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
        return response.data || [];
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
        await apiService.deleteAgent(id);
        addNotification({
          type: "success",
          title: "Success",
          message: "Agent deleted successfully",
        });
        fetchAgents();
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

  const flagAgent = useCallback(
    async (agentId: string, status: string) => {
      try {
        await apiService.flagAgent(agentId, status);
        addNotification({
          type: "success",
          title: "Success",
          message: `Agent ${status} successfully`,
        });
        fetchAgents();
      } catch (error) {
        addNotification({
          type: "error",
          title: "Error",
          message: `Failed to ${status} agent`,
        });
      }
    },
    [addNotification, fetchAgents],
  );

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  const value: AgentsContextType = {
    agents,
    selectedAgent,
    isLoading,
    filters,
    pagination,
    fetchAgents,
    getAgent,
    getAgentProperties,
    deleteAgent,
    flagAgent,
    setFilters,
    setPage,
    setSelectedAgent,
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
