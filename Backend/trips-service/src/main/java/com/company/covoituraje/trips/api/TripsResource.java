package com.company.covoituraje.trips.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

@Path("/trips")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TripsResource {

    private final TripsRepository repository = new TripsRepository();
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    @POST
    public TripDto create(TripCreateDto create) {
        TripDto dto = new TripDto();
        dto.id = java.util.UUID.randomUUID().toString();
        String currentUser = AuthContext.getUserId();
        dto.driverId = (currentUser != null && !currentUser.isBlank()) ? currentUser : java.util.UUID.randomUUID().toString();
        dto.origin = create.origin;
        dto.destinationSedeId = create.destinationSedeId;
        dto.dateTime = create.dateTime;
        dto.seatsTotal = create.seatsTotal;
        dto.seatsFree = create.seatsTotal;
        return repository.save(dto);
    }

    @GET
    public List<TripDto> list(@QueryParam("destinationSedeId") String destinationSedeId,
                         @QueryParam("from") String from,
                         @QueryParam("to") String to) {
        List<TripDto> all = repository.listAll();
        if (destinationSedeId == null) return all;
        List<TripDto> filtered = new ArrayList<>();
        for (TripDto t : all) {
            if (destinationSedeId.equals(t.destinationSedeId)) {
                filtered.add(t);
            }
        }
        return filtered;
    }
}
