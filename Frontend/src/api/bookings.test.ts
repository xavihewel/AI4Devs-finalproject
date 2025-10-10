import { BookingsService } from './bookings';

// Mock env and keycloak
jest.mock('../env', () => ({
  env: {
    bookingApiBaseUrl: 'http://localhost:8083/api',
  },
}));

jest.mock('../auth/keycloak', () => ({
  getKeycloak: () => ({
    updateToken: jest.fn().mockResolvedValue(undefined),
    token: 'test-jwt-token',
  }),
}));

// Mock axios and its instance methods
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPut = jest.fn();

jest.mock('axios', () => {
  return {
    __esModule: true,
    default: {
      create: () => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        interceptors: { request: { use: jest.fn((fn: any) => fn({ headers: {} })) } },
      }),
    },
  };
});

describe('BookingsService API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getMyBookings returns list of bookings', async () => {
    const bookings = [
      {
        id: 'b1',
        tripId: 't1',
        passengerId: 'u1',
        seatsRequested: 1,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    mockGet.mockResolvedValueOnce({ data: bookings });

    const result = await BookingsService.getMyBookings();
    expect(result).toEqual(bookings);
    expect(mockGet).toHaveBeenCalledWith('/bookings');
  });

  it('createBooking posts payload and returns created booking', async () => {
    const payload = { tripId: 't1', seatsRequested: 1 };
    const created = {
      id: 'b2',
      tripId: 't1',
      passengerId: 'u1',
      seatsRequested: 1,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPost.mockResolvedValueOnce({ data: created });

    const result = await BookingsService.createBooking(payload);
    expect(result).toEqual(created);
    expect(mockPost).toHaveBeenCalledWith('/bookings', payload);
  });

  it('cancelBooking calls PUT and returns updated booking', async () => {
    const updated = {
      id: 'b3',
      tripId: 't1',
      passengerId: 'u1',
      seatsRequested: 1,
      status: 'CANCELLED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPut.mockResolvedValueOnce({ data: updated });

    const result = await BookingsService.cancelBooking('b3');
    expect(result).toEqual(updated);
    expect(mockPut).toHaveBeenCalledWith('/bookings/b3/cancel');
  });

  it('confirmBooking calls PUT and returns confirmed booking', async () => {
    const confirmed = {
      id: 'b4',
      tripId: 't1',
      passengerId: 'u1',
      seatsRequested: 1,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPut.mockResolvedValueOnce({ data: confirmed });

    const result = await BookingsService.confirmBooking('b4');
    expect(result).toEqual(confirmed);
    expect(mockPut).toHaveBeenCalledWith('/bookings/b4/confirm');
  });

  it('propagates API errors (e.g., 400 when no seats available) on create', async () => {
    const payload = { tripId: 't1', seatsRequested: 2 };
    const error = Object.assign(new Error('Bad Request'), { response: { status: 400 } });
    mockPost.mockRejectedValueOnce(error);

    await expect(BookingsService.createBooking(payload)).rejects.toBe(error);
  });
});


