import { api } from './client';
import type { TripDto, TripCreateDto } from '../types/api';

export class TripsService {
  /**
   * Get all trips
   */
  static async getAllTrips(): Promise<TripDto[]> {
    const response = await api.get<TripDto[]>('/trips');
    return response.data;
  }

  /**
   * Get trips by destination
   */
  static async getTripsByDestination(destinationSedeId: string): Promise<TripDto[]> {
    const response = await api.get<TripDto[]>(`/trips?destinationSedeId=${destinationSedeId}`);
    return response.data;
  }

  /**
   * Get a specific trip by ID
   */
  static async getTripById(id: string): Promise<TripDto> {
    const response = await api.get<TripDto>(`/trips/${id}`);
    return response.data;
  }

  /**
   * Create a new trip
   */
  static async createTrip(tripData: TripCreateDto): Promise<TripDto> {
    const response = await api.post<TripDto>('/trips', tripData);
    return response.data;
  }

  /**
   * Update an existing trip
   */
  static async updateTrip(id: string, tripData: Partial<TripCreateDto>): Promise<TripDto> {
    const response = await api.put<TripDto>(`/trips/${id}`, tripData);
    return response.data;
  }

  /**
   * Delete a trip
   */
  static async deleteTrip(id: string): Promise<void> {
    await api.delete(`/trips/${id}`);
  }

  /**
   * Get trips created by the current user
   */
  static async getMyTrips(): Promise<TripDto[]> {
    const response = await api.get<TripDto[]>('/trips/my-trips');
    return response.data;
  }
}
