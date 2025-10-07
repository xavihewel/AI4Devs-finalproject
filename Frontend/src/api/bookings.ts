import { api } from './client';
import type { BookingDto, BookingCreateDto } from '../types/api';

export class BookingsService {
  /**
   * Get all bookings for the current user
   */
  static async getMyBookings(): Promise<BookingDto[]> {
    const response = await api.get<BookingDto[]>('/bookings');
    return response.data;
  }

  /**
   * Get a specific booking by ID
   */
  static async getBookingById(id: string): Promise<BookingDto> {
    const response = await api.get<BookingDto>(`/bookings/${id}`);
    return response.data;
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingData: BookingCreateDto): Promise<BookingDto> {
    const response = await api.post<BookingDto>('/bookings', bookingData);
    return response.data;
  }

  /**
   * Confirm a booking
   */
  static async confirmBooking(id: string): Promise<BookingDto> {
    const response = await api.put<BookingDto>(`/bookings/${id}/confirm`);
    return response.data;
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(id: string): Promise<BookingDto> {
    const response = await api.put<BookingDto>(`/bookings/${id}/cancel`);
    return response.data;
  }
}
