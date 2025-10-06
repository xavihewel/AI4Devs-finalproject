package com.company.covoituraje.booking.api;

import com.company.covoituraje.booking.domain.Booking;
import com.company.covoituraje.booking.infrastructure.BookingRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Path("/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    private final BookingRepository repository = new BookingRepository();
    
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    @POST
    public BookingDto create(BookingCreateDto request) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // Validate request
        if (request.tripId == null || request.tripId.isBlank()) {
            throw new BadRequestException("Trip ID is required");
        }
        if (request.seatsRequested == null || request.seatsRequested <= 0) {
            throw new BadRequestException("Valid number of seats is required");
        }

        // Parse tripId
        UUID tripId;
        try {
            tripId = UUID.fromString(request.tripId);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid trip ID format");
        }

        // Create booking
        Booking booking = new Booking(tripId, currentUser, request.seatsRequested, "PENDING");
        booking = repository.save(booking);
        
        return mapToDto(booking);
    }

    @GET
    public List<BookingDto> listMine() {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        List<Booking> bookings = repository.findByPassengerId(currentUser);
        return bookings.stream()
                .map(this::mapToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @GET
    @Path("/{id}")
    public BookingDto getById(@PathParam("id") String id) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        UUID bookingId;
        try {
            bookingId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid booking ID format");
        }

        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        // Ensure user can only access their own bookings
        if (!currentUser.equals(booking.getPassengerId())) {
            throw new ForbiddenException("Access denied");
        }

        return mapToDto(booking);
    }

    @PUT
    @Path("/{id}/confirm")
    public BookingDto confirm(@PathParam("id") String id) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        UUID bookingId;
        try {
            bookingId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid booking ID format");
        }

        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (!currentUser.equals(booking.getPassengerId())) {
            throw new ForbiddenException("Access denied");
        }

        if (!booking.isPending()) {
            throw new BadRequestException("Only pending bookings can be confirmed");
        }

        booking.confirm();
        booking = repository.save(booking);
        
        return mapToDto(booking);
    }

    @PUT
    @Path("/{id}/cancel")
    public BookingDto cancel(@PathParam("id") String id) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        UUID bookingId;
        try {
            bookingId = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid booking ID format");
        }

        Booking booking = repository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));

        if (!currentUser.equals(booking.getPassengerId())) {
            throw new ForbiddenException("Access denied");
        }

        if (booking.isCancelled()) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.cancel();
        booking = repository.save(booking);
        
        return mapToDto(booking);
    }

    private BookingDto mapToDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.id = booking.getId().toString();
        dto.tripId = booking.getTripId().toString();
        dto.passengerId = booking.getPassengerId();
        dto.seatsRequested = booking.getSeatsRequested();
        dto.status = booking.getStatus();
        return dto;
    }

    public static class BookingCreateDto {
        public String tripId;
        public Integer seatsRequested;
    }
}
