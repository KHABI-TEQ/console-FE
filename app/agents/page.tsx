"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { AgentManagement } from "@/components/agents/AgentManagement";
import { AgentsProvider } from "@/contexts/AgentsContext";
import { LandlordsProvider } from "@/contexts/LandlordsContext";

export default function AgentsPage() {
  return (
    <AgentsProvider>
      <LandlordsProvider>
        <AdminLayout>
          <AgentManagement defaultTab="agents" />
        </AdminLayout>
      </LandlordsProvider>
    </AgentsProvider>
  );
}
