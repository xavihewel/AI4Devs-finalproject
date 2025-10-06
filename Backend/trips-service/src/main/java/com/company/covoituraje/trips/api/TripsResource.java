package com.company.covoituraje.trips.api;

import com.company.covoituraje.trips.domain.Trip;
import com.company.covoituraje.trips.infrastructure.TripRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Path("/trips")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TripsResource {

    private final TripRepository repository = new TripRepository();
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    @POST
    public TripDto create(TripCreateDto create) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // Parse dateTime from ISO8601 string
        OffsetDateTime dateTime = OffsetDateTime.parse(create.dateTime, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        
        Trip trip = new Trip(currentUser, create.origin, create.destinationSedeId, dateTime, create.seatsTotal);
        trip = repository.save(trip);
        
        return mapToDto(trip);
    }

    @GET
    public List<TripDto> list(@QueryParam("destinationSedeId") String destinationSedeId,
                             @QueryParam("from") String from,
                             @QueryParam("to") String to) {
        
        List<Trip> trips;
        if (destinationSedeId != null) {
            trips = repository.findByDestinationSedeId(destinationSedeId);
        } else {
            trips = repository.findAll();
        }
        
        // TODO: Add date range filtering when 'from' and 'to' parameters are provided
        
        return trips.stream()
                .map(this::mapToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @GET
    @Path("/{id}")
    public TripDto getById(@PathParam("id") String id) {
        UUID tripId = UUID.fromString(id);
        Trip trip = repository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found"));
        return mapToDto(trip);
    }

    private TripDto mapToDto(Trip trip) {
        TripDto dto = new TripDto();
        dto.id = trip.getId().toString();
        dto.driverId = trip.getDriverId();
        dto.origin = trip.getOrigin();
        dto.destinationSedeId = trip.getDestinationSedeId();
        dto.dateTime = trip.getDateTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        dto.seatsTotal = trip.getSeatsTotal();
        dto.seatsFree = trip.getSeatsFree();
        return dto;
    }
}
