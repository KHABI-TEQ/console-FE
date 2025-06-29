"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const authToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));

    if (authToken) {
      // Redirect to dashboard if authenticated
      router.replace("/dashboard");
    } else {
      // Redirect to login if not authenticated
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}
