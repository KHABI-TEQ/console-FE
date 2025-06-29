"use client";

import { Suspense } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { AgentManagement } from "@/components/agents/AgentManagement";
import { AgentsProvider } from "@/contexts/AgentsContext";
import { LandlordsProvider } from "@/contexts/LandlordsContext";
import { AgentsLandlordsSkeleton } from "@/components/skeletons/PageSkeletons";

export default function AgentsPage() {
  return (
    <AgentsProvider>
      <LandlordsProvider>
        <AdminLayout>
          <Suspense fallback={<AgentsLandlordsSkeleton />}>
            <AgentManagement defaultTab="agents" />
          </Suspense>
        </AdminLayout>
      </LandlordsProvider>
    </AgentsProvider>
  );
}
