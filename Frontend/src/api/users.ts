import { api } from './client';
import type { UserDto, UserUpdateDto } from '../types/api';

export class UsersService {
  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<UserDto> {
    const response = await api.get<UserDto>('/users/me');
    return response.data;
  }

  /**
   * Update current user profile
   */
  static async updateCurrentUser(userData: UserUpdateDto): Promise<UserDto> {
    const response = await api.put<UserDto>('/users/me', userData);
    return response.data;
  }

  /**
   * Get user by ID (for admin purposes)
   */
  static async getUserById(id: string): Promise<UserDto> {
    const response = await api.get<UserDto>(`/users/${id}`);
    return response.data;
  }
}
