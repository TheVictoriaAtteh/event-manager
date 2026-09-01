/**
 * TypeScript interfaces for Hall (venue) related API responses.
 * Based on backend Prisma schema and NestJS controllers.
 */

export interface Hall {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  capacity: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHallInput {
  name: string;
  address: string;
  capacity: number;
}

export interface UpdateHallInput {
  name?: string;
  address?: string;
  capacity?: number;
}
