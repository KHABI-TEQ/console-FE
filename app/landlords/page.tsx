"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { AgentsLandlordsSkeleton } from "@/components/skeletons/PageSkeletons";

export default function LandlordsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to agents page with landlords tab
    router.replace("/agents?tab=landlords");
  }, [router]);

  return (
    <AdminLayout>
      <AgentsLandlordsSkeleton />
    </AdminLayout>
  );
}
