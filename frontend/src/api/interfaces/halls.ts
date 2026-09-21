/** TypeScript contracts for the external API's /halls routes. */

export interface Hall {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  capacity: number;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    events: number;
  };
}

export interface CreateHallInput {
  name: string;
  address?: string;
  description?: string;
  capacity: number;
}

export interface UpdateHallInput {
  name?: string;
  address?: string;
  description?: string;
  capacity?: number;
}
