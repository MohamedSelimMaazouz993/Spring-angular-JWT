export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UserDto {
  username: string;
  email: string;
  password?: string;
  roles: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
}
