/**
 * API client for Hall (venue) management endpoints.
 * Connects to the NestJS backend /halls routes.
 */

import { apiFetch } from "./apiClient";
import type {
  Hall,
  CreateHallInput,
  UpdateHallInput,
} from "../api/interfaces/halls";

export const hallsApi = {
  /**
   * Get all halls.
   */
  list(): Promise<Hall[]> {
    return apiFetch<Hall[]>("/halls");
  },

  /**
   * Get a single hall by ID.
   */
  get(id: string): Promise<Hall> {
    return apiFetch<Hall>(`/halls/${id}`);
  },

  /**
   * Create a new hall.
   */
  create(input: CreateHallInput): Promise<Hall> {
    return apiFetch<Hall>("/halls", {
      method: "POST",
      body: input,
    });
  },

  /**
   * Update an existing hall.
   */
  update(id: string, input: UpdateHallInput): Promise<Hall> {
    return apiFetch<Hall>(`/halls/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  /**
   * Delete a hall.
   */
  remove(id: string): Promise<Hall> {
    return apiFetch<Hall>(`/halls/${id}`, {
      method: "DELETE",
    });
  },
};
