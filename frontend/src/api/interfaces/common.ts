export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
  meta: Record<string, any>;
}

export interface ResponseStructure<T> {
  code: number;
  message?: string;
  data: T | undefined;
  meta: Record<string, T> & {
    pagination?: { page: number; count: number; total: number; size: number };
  };
}
