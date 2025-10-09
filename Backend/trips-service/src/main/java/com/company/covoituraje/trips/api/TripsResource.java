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

    private final TripRepository repository;
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    public TripsResource() {
        this.repository = new TripRepository();
    }

    public TripsResource(TripRepository repository) {
        this.repository = repository;
    }

    @POST
    public TripDto create(TripCreateDto create) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // Parse dateTime from ISO8601 string
        OffsetDateTime dateTime = OffsetDateTime.parse(create.dateTime, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        
        // Convert origin to string format
        String originString = create.origin.lat + "," + create.origin.lng;
        
        Trip trip = new Trip(currentUser, originString, create.destinationSedeId, dateTime, create.seatsTotal);
        trip = repository.save(trip);
        
        return mapToDto(trip);
    }

    @GET
    public List<TripDto> list(@QueryParam("destinationSedeId") String destinationSedeId,
                             @QueryParam("from") String from,
                             @QueryParam("to") String to) {
        
        // Prefer full datetime ISO filtering if both from/to are ISO-8601
        java.time.OffsetDateTime fromDt = parseIsoDatetime(from);
        java.time.OffsetDateTime toDt = parseIsoDatetime(to);
        List<Trip> trips;
        if (fromDt != null && toDt != null) {
            if (destinationSedeId != null && !destinationSedeId.isBlank()) {
                trips = repository.findByDestinationSedeIdAndDateTimeBetween(destinationSedeId, fromDt, toDt);
            } else {
                trips = repository.findByDateTimeBetween(fromDt, toDt);
            }
        } else {
            // Fallback: load base set and filter by HH:mm if provided
            if (destinationSedeId != null) {
                trips = repository.findByDestinationSedeId(destinationSedeId);
            } else {
                trips = repository.findAll();
            }
            if ((from != null && !from.isBlank()) || (to != null && !to.isBlank())) {
                Integer fromMinutes = parseTimeToMinutes(from);
                Integer toMinutes = parseTimeToMinutes(to);
                trips = trips.stream()
                        .filter(t -> withinRangeByTimeOfDay(t.getDateTime(), fromMinutes, toMinutes))
                        .collect(java.util.stream.Collectors.toList());
            }
        }

        return trips.stream()
                .map(this::mapToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    private Integer parseTimeToMinutes(String hhmm) {
        if (hhmm == null || hhmm.isBlank()) return null;
        try {
            String[] parts = hhmm.split(":");
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            return h * 60 + m;
        } catch (Exception e) {
            return null; // Silently ignore malformed times
        }
    }

    private boolean withinRangeByTimeOfDay(java.time.OffsetDateTime dateTime, Integer fromMinutes, Integer toMinutes) {
        int minutes = dateTime.getHour() * 60 + dateTime.getMinute();
        if (fromMinutes != null && minutes < fromMinutes) return false;
        if (toMinutes != null && minutes > toMinutes) return false;
        return true;
    }

    private java.time.OffsetDateTime parseIsoDatetime(String iso) {
        if (iso == null || iso.isBlank()) return null;
        try {
            return java.time.OffsetDateTime.parse(iso, java.time.format.DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        } catch (Exception e) {
            return null;
        }
    }

    @GET
    @Path("/{id}")
    public TripDto getById(@PathParam("id") String id) {
        UUID tripId = UUID.fromString(id);
        Trip trip = repository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found"));
        return mapToDto(trip);
    }

    @PUT
    @Path("/{id}")
    public TripDto update(@PathParam("id") String id, TripCreateDto update) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        UUID tripId = UUID.fromString(id);
        Trip trip = repository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found"));

        // Only the driver can update their trip (basic rule)
        if (!currentUser.equals(trip.getDriverId())) {
            throw new ForbiddenException("Only the driver can update the trip");
        }

        // Apply partial updates
        if (update != null) {
            if (update.destinationSedeId != null && !update.destinationSedeId.isBlank()) {
                trip.setDestinationSedeId(update.destinationSedeId);
            }
            if (update.dateTime != null && !update.dateTime.isBlank()) {
                OffsetDateTime dt = OffsetDateTime.parse(update.dateTime, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                trip.setDateTime(dt);
            }
            if (update.seatsTotal > 0) {
                trip.setSeatsTotal(update.seatsTotal);
            }
            if (update.origin != null) {
                String originString = update.origin.lat + "," + update.origin.lng;
                trip.setOrigin(originString);
            }
        }

        trip = repository.save(trip);
        return mapToDto(trip);
    }

    @DELETE
    @Path("/{id}")
    public void delete(@PathParam("id") String id) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        UUID tripId = UUID.fromString(id);
        Trip trip = repository.findById(tripId)
                .orElseThrow(() -> new NotFoundException("Trip not found"));

        if (!currentUser.equals(trip.getDriverId())) {
            throw new ForbiddenException("Only the driver can delete the trip");
        }

        repository.delete(trip);
    }

    private TripDto mapToDto(Trip trip) {
        TripDto dto = new TripDto();
        dto.id = trip.getId().toString();
        dto.driverId = trip.getDriverId();
        
        // Convert origin string to TripDto.Origin
        String[] coords = trip.getOrigin().split(",");
        TripDto.Origin origin = new TripDto.Origin();
        origin.lat = Double.parseDouble(coords[0]);
        origin.lng = Double.parseDouble(coords[1]);
        dto.origin = origin;
        
        dto.destinationSedeId = trip.getDestinationSedeId();
        dto.dateTime = trip.getDateTime().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
        dto.seatsTotal = trip.getSeatsTotal();
        dto.seatsFree = trip.getSeatsFree();
        return dto;
    }
}
