"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/layout/AdminLayout";
import { LoadingPlaceholder } from "@/components/shared/LoadingPlaceholder";

export default function LandlordsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to agents page with landlords tab
    router.replace("/agents?tab=landlords");
  }, [router]);

  return (
    <AdminLayout>
      <LoadingPlaceholder
        type="page"
        title="Redirecting to Agent Management..."
      />
    </AdminLayout>
  );
}
