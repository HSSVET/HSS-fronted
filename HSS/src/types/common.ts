// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed';

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  role: 'admin' | 'veterinarian' | 'assistant';
  phone?: string;
  avatar?: string;
} 