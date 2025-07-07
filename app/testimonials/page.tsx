"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import TestimonialManagement from "@/components/testimonials/TestimonialManagement";
import { TestimonialsProvider } from "@/contexts/TestimonialsContext";

export default function TestimonialsPage() {
  return (
    <TestimonialsProvider>
      <AdminLayout>
        <TestimonialManagement />
      </AdminLayout>
    </TestimonialsProvider>
  );
}
