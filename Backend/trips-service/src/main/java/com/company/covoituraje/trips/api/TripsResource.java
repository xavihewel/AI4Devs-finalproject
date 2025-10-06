package com.company.covoituraje.trips.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

@Path("/trips")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TripsResource {

    @POST
    public TripDto create(TripCreateDto create) {
        TripDto dto = new TripDto();
        dto.id = java.util.UUID.randomUUID().toString();
        dto.driverId = java.util.UUID.randomUUID().toString();
        dto.origin = create.origin;
        dto.destinationSedeId = create.destinationSedeId;
        dto.dateTime = create.dateTime;
        dto.seatsTotal = create.seatsTotal;
        dto.seatsFree = create.seatsTotal;
        return dto;
    }

    @GET
    public List<TripDto> list(@QueryParam("destinationSedeId") String destinationSedeId,
                         @QueryParam("from") String from,
                         @QueryParam("to") String to) {
        return new ArrayList<>();
    }
}
