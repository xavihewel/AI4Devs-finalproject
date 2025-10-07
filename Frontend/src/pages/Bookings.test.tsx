import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Bookings from './Bookings';

jest.mock('../api/bookings', () => {
  return {
    BookingsService: {
      getMyBookings: jest.fn(),
      createBooking: jest.fn(),
      cancelBooking: jest.fn(),
    },
  };
});

const { BookingsService } = jest.requireMock('../api/bookings');

describe('Bookings page', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('shows empty state when there are no bookings', async () => {
    BookingsService.getMyBookings.mockResolvedValueOnce([]);
    await act(async () => {
      render(<Bookings />);
    });
    expect(await screen.findByText('No tienes reservas.')).toBeInTheDocument();
  });

  it('renders list of bookings', async () => {
    BookingsService.getMyBookings.mockResolvedValueOnce([
      { id: 'b1', tripId: 't1', passengerId: 'u1', seatsRequested: 1, status: 'PENDING', createdAt: '', updatedAt: '' },
    ]);
    await act(async () => {
      render(<Bookings />);
    });
    expect(await screen.findByText(/#b1/)).toBeInTheDocument();
    expect(screen.getByLabelText('status-pending')).toBeInTheDocument();
  });

  it('creates a booking and prepends it to the list, then clears inputs', async () => {
    BookingsService.getMyBookings.mockResolvedValueOnce([]);
    BookingsService.createBooking.mockImplementation(async (payload: any) => ({
      id: 'b2',
      tripId: payload.tripId,
      passengerId: 'me',
      seatsRequested: payload.seatsRequested,
      status: 'PENDING',
      createdAt: '',
      updatedAt: '',
    }));

    await act(async () => {
      render(<Bookings />);
    });

    const tripInput = screen.getByLabelText('Trip ID');
    const seatsInput = screen.getByLabelText('Seats');
    const createBtn = screen.getByRole('button', { name: /crear reserva/i });

    await userEvent.clear(tripInput);
    await userEvent.type(tripInput, 't-new');
    await userEvent.clear(seatsInput);
    await userEvent.type(seatsInput, '2');
    await userEvent.click(createBtn);

    expect(await screen.findByText(/#b2/)).toBeInTheDocument();
    expect((tripInput as HTMLInputElement).value).toBe('');
    expect((seatsInput as HTMLInputElement).value).toBe('1');
  });

  it('cancels a booking and updates status badge', async () => {
    const existing = { id: 'b3', tripId: 't3', passengerId: 'u1', seatsRequested: 1, status: 'PENDING', createdAt: '', updatedAt: '' };
    BookingsService.getMyBookings.mockResolvedValueOnce([existing]);
    BookingsService.cancelBooking.mockResolvedValueOnce({ ...existing, status: 'CANCELLED' });

    await act(async () => {
      render(<Bookings />);
    });

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await userEvent.click(cancelBtn);

    expect(await screen.findByLabelText('status-cancelled')).toBeInTheDocument();
  });
});


