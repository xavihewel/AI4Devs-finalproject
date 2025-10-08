import axios from 'axios';
import { getKeycloak } from '../auth/keycloak';
import type { UserDto, UserUpdateDto } from '../types/api';

// Users service runs on port 8082
const usersApi = axios.create({
  baseURL: 'http://localhost:8082/api',
});

// Add auth interceptor for users API
usersApi.interceptors.request.use(async (config) => {
  const keycloak = getKeycloak();
  if (keycloak) {
    try {
      await keycloak.updateToken(5);
    } catch (_) {
      // ignore refresh errors
    }
    const token = keycloak.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export class UsersService {
  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserDto> {
    const response = await usersApi.get<UserDto>('/users/me');
    return response.data;
  }

  /**
   * Update current user profile
   */
  static async updateCurrentUser(userData: UserUpdateDto): Promise<UserDto> {
    const response = await usersApi.put<UserDto>('/users/me', userData);
    return response.data;
  }

  /**
   * Get user by ID (for admin purposes)
   */
  static async getUserById(id: string): Promise<UserDto> {
    const response = await usersApi.get<UserDto>(`/users/${id}`);
    return response.data;
  }
}
