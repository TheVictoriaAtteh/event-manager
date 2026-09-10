/**
 * API client for Hall (venue) management endpoints.
 * Connects to the NestJS backend /halls routes.
 */

import { apiRequest } from "./apiClient";
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
    return apiRequest<Hall[]>({ url: "/halls", method: "GET" });
  },

  /**
   * Get a single hall by ID.
   */
  get(id: string): Promise<Hall> {
    return apiRequest<Hall>({ url: `/halls/${id}`, method: "GET" });
  },

  /**
   * Create a new hall.
   */
  create(input: CreateHallInput): Promise<Hall> {
    return apiRequest<Hall>({ url: "/halls", method: "POST", data: input });
  },

  /**
   * Update an existing hall.
   */
  update(id: string, input: UpdateHallInput): Promise<Hall> {
    return apiRequest<Hall>({ url: `/halls/${id}`, method: "PATCH", data: input });
  },

  /**
   * Delete a hall.
   */
  remove(id: string): Promise<Hall> {
    return apiRequest<Hall>({ url: `/halls/${id}`, method: "DELETE" });
  },
};
