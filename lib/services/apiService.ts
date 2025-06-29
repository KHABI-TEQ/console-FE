export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success: boolean;
  error?: string;
  page?: number;
  limit?: number;
  total?: number;
  users?: T[];
  admin?: T;
  token?: string;
  pagination?: T;
}

export interface PaginatedResponse<T>
  extends Omit<ApiResponse<T>, "pagination"> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:8081/api/admin",
  ) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof document !== "undefined") {
      const authToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="));

      return authToken ? authToken.split("=")[1] : null;
    }

    return null;
  }

  private getAuthHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...this.getAuthHeaders(includeAuth),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      // Handle empty responses
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        data = {};
      }

      if (!response.ok) {
        // Handle auth errors

        if (response.status === 401 || response.status === 403) {
          // Clear auth token and redirect to login
          if (typeof document !== "undefined") {
            document.cookie = "auth-token=; path=/; max-age=0";
            // if (window.location.pathname !== "/auth/login") {
            //   window.location.href = "/auth/login";
            // }
          }
        }

        // Return error response instead of throwing
        return {
          success: false,
          error:
            data.message ||
            data.error ||
            `HTTP error! status: ${response.status}`,
          message:
            data.message ||
            data.error ||
            `Request failed with status ${response.status}`,
        };
      }

      // Handle different response formats
      const normalizedData = {
        ...data,
        success: true,
        // Ensure data field exists for consistency
        data: data.data || data.result || data,
        // Handle pagination metadata
        total: data.total || data.count || data.pagination?.total,
        page: data.page || data.pagination?.page,
        limit: data.limit || data.pagination?.limit,
        totalPages: data.totalPages || data.pagination?.totalPages,
      };

      return normalizedData;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);

      // Check if it's a network error
      const isNetworkError =
        error instanceof Error &&
        (error.message.includes("fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Failed to fetch"));

      // Return error response instead of throwing
      return {
        success: false,
        error: isNetworkError
          ? "Network connection failed. Please check your internet connection."
          : error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        message: isNetworkError
          ? "Unable to connect to the server"
          : "Network or parsing error occurred",
      };
    }
  }

  // Generic CRUD operations
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url, {}, includeAuth);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }

  async put<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth,
    );
  }

  async delete<T>(
    endpoint: string,
    includeAuth: boolean = true,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" }, includeAuth);
  }

  // Auth methods (no auth token needed)
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.post("/login", credentials, false);
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return this.post("/forgot-password", { email }, false);
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<ApiResponse<any>> {
    return this.post("/reset-password", { token, password }, false);
  }

  async getProfile(): Promise<ApiResponse<any>> {
    return this.get("/profile");
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.post("/logout");
  }

  // Inspection-specific methods
  async getInspections(filters?: any): Promise<ApiResponse<any[]>> {
    return this.get("/inspections", filters);
  }

  async getInspection(id: string): Promise<ApiResponse<any>> {
    return this.get(`/inspections/${id}`);
  }

  async approveInspection(id: string): Promise<ApiResponse<any>> {
    return this.post(`/inspections/${id}/approve`);
  }

  async rejectInspection(
    id: string,
    reason: string,
  ): Promise<ApiResponse<any>> {
    return this.post(`/inspections/${id}/reject`, { reason });
  }

  async updateInspectionStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.patch(`/inspections/${id}/status`, { status });
  }

  // Agent-specific methods
  async getAgents(filters?: any): Promise<ApiResponse<any>> {
    return this.get("/agents", filters);
  }

  async getAgent(id: string): Promise<ApiResponse<any>> {
    return this.get(`/agent/${id}`);
  }

  async createAgent(agentData: any): Promise<ApiResponse<any>> {
    return this.post("/agents", agentData);
  }

  async updateAgent(id: string, agentData: any): Promise<ApiResponse<any>> {
    return this.put(`/agent/${id}`, agentData);
  }

  async deleteAgent(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/agent/${id}`);
  }

  async flagAgent(agentId: string, status: string): Promise<ApiResponse<any>> {
    return this.patch(`/agent/flag/${agentId}`, { status });
  }

  async getAgentProperties(agentId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/agent/${agentId}/properties`);
  }

  // Landowners-specific methods
  async getLandowners(filters?: any): Promise<ApiResponse<any>> {
    return this.get("/landowners", filters);
  }

  async getLandowner(id: string): Promise<ApiResponse<any>> {
    return this.get(`/landowner/${id}`);
  }

  async createLandowner(landownerData: any): Promise<ApiResponse<any>> {
    return this.post("/landowners", landownerData);
  }

  async updateLandowner(
    id: string,
    landownerData: any,
  ): Promise<ApiResponse<any>> {
    return this.put(`/landowner/${id}`, landownerData);
  }

  async deleteLandowner(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/landowner/${id}`);
  }

  // Property-specific methods
  async getProperties(filters?: any): Promise<ApiResponse<any[]>> {
    return this.get("/properties", filters);
  }

  async getProperty(id: string): Promise<ApiResponse<any>> {
    return this.get(`/property/${id}`);
  }

  async createProperty(propertyData: any): Promise<ApiResponse<any>> {
    return this.post("/properties", propertyData);
  }

  async updateProperty(
    id: string,
    propertyData: any,
  ): Promise<ApiResponse<any>> {
    return this.put(`/property/${id}`, propertyData);
  }

  async deleteProperty(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/property/${id}`);
  }

  async approveProperty(id: string): Promise<ApiResponse<any>> {
    return this.patch(`/property/${id}/approve`);
  }

  async rejectProperty(id: string, reason?: string): Promise<ApiResponse<any>> {
    return this.patch(`/property/${id}/reject`, { reason });
  }

  // Buyer-specific methods
  async getBuyers(filters?: any): Promise<ApiResponse<any[]>> {
    return this.get("/buyers", filters);
  }

  async getBuyer(id: string): Promise<ApiResponse<any>> {
    return this.get(`/buyer/${id}`);
  }

  async createBuyer(buyerData: any): Promise<ApiResponse<any>> {
    return this.post("/buyers", buyerData);
  }

  async updateBuyer(id: string, buyerData: any): Promise<ApiResponse<any>> {
    return this.put(`/buyer/${id}`, buyerData);
  }

  async deleteBuyer(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/buyer/${id}`);
  }

  // Brief-specific methods
  async getBriefs(filters?: any): Promise<ApiResponse<any[]>> {
    return this.get("/briefs", filters);
  }

  async getBrief(id: string): Promise<ApiResponse<any>> {
    return this.get(`/brief/${id}`);
  }

  async createBrief(briefData: any): Promise<ApiResponse<any>> {
    return this.post("/briefs", briefData);
  }

  async updateBrief(id: string, briefData: any): Promise<ApiResponse<any>> {
    return this.put(`/brief/${id}`, briefData);
  }

  async deleteBrief(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/brief/${id}`);
  }

  // Contact-specific methods
  async getContacts(filters?: any): Promise<ApiResponse<any[]>> {
    return this.get("/contacts", filters);
  }

  async getContact(id: string): Promise<ApiResponse<any>> {
    return this.get(`/contact/${id}`);
  }

  async createContact(contactData: any): Promise<ApiResponse<any>> {
    return this.post("/contacts", contactData);
  }

  async updateContact(id: string, contactData: any): Promise<ApiResponse<any>> {
    return this.put(`/contact/${id}`, contactData);
  }

  async deleteContact(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/contact/${id}`);
  }

  // Preferences-specific methods
  async getPreferences(): Promise<ApiResponse<any>> {
    return this.get("/preferences");
  }

  async updatePreferences(preferences: any): Promise<ApiResponse<any>> {
    return this.put("/preferences", preferences);
  }

  async getBuyerPreferences(buyerId?: string): Promise<ApiResponse<any>> {
    const endpoint = buyerId
      ? `/preferences/buyer/${buyerId}`
      : "/preferences/buyer";
    return this.get(endpoint);
  }

  async updateBuyerPreferences(
    buyerId: string,
    preferences: any,
  ): Promise<ApiResponse<any>> {
    return this.put(`/preferences/buyer/${buyerId}`, preferences);
  }

  async getTenantPreferences(): Promise<ApiResponse<any>> {
    return this.get("/preferences/tenant");
  }

  async updateTenantPreferences(preferences: any): Promise<ApiResponse<any>> {
    return this.put("/preferences/tenant", preferences);
  }

  async getDeveloperPreferences(): Promise<ApiResponse<any>> {
    return this.get("/preferences/developer");
  }

  async updateDeveloperPreferences(
    preferences: any,
  ): Promise<ApiResponse<any>> {
    return this.put("/preferences/developer", preferences);
  }

  // Admin management methods
  async getAdmins(): Promise<ApiResponse<any[]>> {
    return this.get("/admins");
  }

  async getAdmin(id: string): Promise<ApiResponse<any>> {
    return this.get(`/admin/${id}`);
  }

  async createAdmin(adminData: any): Promise<ApiResponse<any>> {
    return this.post("/admins", adminData);
  }

  async updateAdmin(id: string, adminData: any): Promise<ApiResponse<any>> {
    return this.put(`/admin/${id}`, adminData);
  }

  async deleteAdmin(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/admin/${id}`);
  }

  async changeAdminStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.patch(`/admin/${id}/status`, { status });
  }

  // Analytics methods
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.get("/analytics/dashboard");
  }

  async getPropertyStats(): Promise<ApiResponse<any>> {
    return this.get("/analytics/properties");
  }

  async getAgentStats(): Promise<ApiResponse<any>> {
    return this.get("/analytics/agents");
  }

  async getBuyerStats(): Promise<ApiResponse<any>> {
    return this.get("/analytics/buyers");
  }

  async getInspectionStats(): Promise<ApiResponse<any>> {
    return this.get("/analytics/inspections");
  }
}

export const apiService = new ApiService();
export default apiService;
