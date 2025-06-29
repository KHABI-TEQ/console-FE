export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8081/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`,
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Generic CRUD operations
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params)}`
      : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // Inspection-specific methods
  async getInspections(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/inspections", filters);
  }

  async getInspection(id: string): Promise<ApiResponse<any>> {
    return this.get(`/inspections/${id}`);
  }

  async getSingleInspection(id: string): Promise<ApiResponse<any>> {
    return this.get(`/inspections/${id}`);
  }

  async updateInspectionStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.patch(`/inspections/${id}/status`, { status });
  }

  // Property-specific methods
  async getProperties(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/properties", filters);
  }

  async getProperty(id: string): Promise<ApiResponse<any>> {
    return this.get(`/properties/${id}`);
  }

  async createProperty(propertyData: any): Promise<ApiResponse<any>> {
    return this.post("/property/new", propertyData);
  }

  async deleteProperty(id: string): Promise<ApiResponse<any>> {
    return this.delete("/delete-property", { id });
  }

  async approveDisapproveProperty(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.patch("/approve-disapprove-property", { id, status });
  }

  // Agent-specific methods
  async getAgents(filters?: any): Promise<ApiResponse<any>> {
    return this.get("/agents", filters);
  }

  async getAllAgents(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/all-agents", filters);
  }

  async getAgent(id: string): Promise<ApiResponse<any>> {
    return this.get(`/agent/${id}`);
  }

  // Landowners-specific methods
  async getLandowners(filters?: any): Promise<ApiResponse<any>> {
    return this.get("/landowners", filters);
  }

  async getAgentProperties(agentId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/agent/${agentId}/properties`);
  }

  async deleteAgent(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/delete-agent/${id}`);
  }

  async flagAgent(agentId: string, status: string): Promise<ApiResponse<any>> {
    return this.patch(`/agent/flag/${agentId}/${status}`);
  }

  // Buyer-specific methods
  async getBuyers(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/buyers", filters);
  }

  async getBuyer(id: string): Promise<ApiResponse<any>> {
    return this.get(`/buyers/${id}`);
  }

  async createBuyer(buyerData: any): Promise<ApiResponse<any>> {
    return this.post("/buyers", buyerData);
  }

  async updateBuyer(id: string, buyerData: any): Promise<ApiResponse<any>> {
    return this.put(`/buyers/${id}`, buyerData);
  }

  async deleteBuyer(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/buyers/${id}`);
  }

  // Brief-specific methods
  async getBriefs(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/briefs", filters);
  }

  async getBrief(id: string): Promise<ApiResponse<any>> {
    return this.get(`/briefs/${id}`);
  }

  async createBrief(briefData: any): Promise<ApiResponse<any>> {
    return this.post("/briefs", briefData);
  }

  async updateBrief(id: string, briefData: any): Promise<ApiResponse<any>> {
    return this.put(`/briefs/${id}`, briefData);
  }

  async deleteBrief(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/briefs/${id}`);
  }

  // Contact-specific methods
  async getContacts(filters?: any): Promise<PaginatedResponse<any[]>> {
    return this.get("/contacts", filters);
  }

  async getContact(id: string): Promise<ApiResponse<any>> {
    return this.get(`/contacts/${id}`);
  }

  async createContact(contactData: any): Promise<ApiResponse<any>> {
    return this.post("/contacts", contactData);
  }

  async updateContact(id: string, contactData: any): Promise<ApiResponse<any>> {
    return this.put(`/contacts/${id}`, contactData);
  }

  async deleteContact(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/contacts/${id}`);
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

  // Admin management methods
  async createAdmin(adminData: any): Promise<ApiResponse<any>> {
    return this.post("/create-admin", adminData);
  }

  async fetchAdmins(): Promise<ApiResponse<any[]>> {
    return this.get("/fetch-admins");
  }

  async getSingleAdmin(id: string): Promise<ApiResponse<any>> {
    return this.get(`/get-single-admin/${id}`);
  }

  async updateAdmin(id: string, adminData: any): Promise<ApiResponse<any>> {
    return this.patch(`/update-admin/${id}`, adminData);
  }

  async changeAdminStatus(
    id: string,
    status: string,
  ): Promise<ApiResponse<any>> {
    return this.patch(`/change-status/${id}`, { status });
  }

  async deleteAdmin(id: string): Promise<ApiResponse<any>> {
    return this.delete(`/delete-admin/${id}`);
  }

  // Auth methods
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<any>> {
    return this.post("/auth/login", credentials);
  }

  async logout(): Promise<ApiResponse<any>> {
    return this.post("/auth/logout");
  }

  async forgotPassword(email: string): Promise<ApiResponse<any>> {
    return this.post("/auth/forgot-password", { email });
  }

  async resetPassword(
    token: string,
    password: string,
  ): Promise<ApiResponse<any>> {
    return this.post("/auth/reset-password", { token, password });
  }
}

export const apiService = new ApiService();
export default apiService;
