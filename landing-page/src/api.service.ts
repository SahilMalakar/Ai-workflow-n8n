import { API_CONFIG } from "./config";
import type { ResourceType } from "./types";

class ApiService {
  private baseUrl = API_CONFIG.BASE_URL;

  async getAll<T>(resource: ResourceType): Promise<{ data: T[], _mocked?: boolean }> {
    const response = await fetch(`${this.baseUrl}/api/v1/${resource}`);
    if (!response.ok) throw new Error(`Failed to fetch ${resource}`);
    return await response.json();
  }

  async getOne<T>(resource: ResourceType, id: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/v1/${resource}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch ${resource} with id ${id}`);
    const result = await response.json();
    return result.data;
  }

  async create<T>(resource: ResourceType, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/v1/${resource}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create ${resource}`);
    const result = await response.json();
    return result.data;
  }

  async update<T>(resource: ResourceType, id: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/v1/${resource}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update ${resource}`);
    const result = await response.json();
    return result.data;
  }

  async delete(resource: ResourceType, id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/${resource}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok && response.status !== 204) {
      throw new Error(`Failed to delete ${resource}`);
    }
  }
}

export const apiService = new ApiService();
