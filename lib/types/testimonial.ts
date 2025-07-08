export interface Testimonial {
  _id: string;
  fullName: string;
  occupation: string;
  rating: number;
  message: string;
  status: "pending" | "approved" | "rejected";
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTestimonialPayload {
  fullName: string;
  occupation: string;
  rating: number;
  message: string;
  profileImage?: string;
}

export interface UpdateTestimonialPayload
  extends Partial<CreateTestimonialPayload> {
  status?: "pending" | "approved" | "rejected";
}

export interface TestimonialsResponse {
  success: boolean;
  testimonials: Testimonial[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
  };
}

export interface TestimonialResponse {
  success: boolean;
  data: Testimonial;
}

export interface TestimonialsFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "approved" | "rejected" | "all";
}
