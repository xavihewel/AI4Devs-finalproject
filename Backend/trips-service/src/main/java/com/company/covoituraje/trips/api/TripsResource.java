package com.company.covoituraje.trips.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.ArrayList;
import java.util.List;

@Path("/trips")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TripsResource {

    @POST
    public Response create(TripCreateDto create) {
        TripDto dto = new TripDto();
        dto.id = java.util.UUID.randomUUID().toString();
        dto.driverId = java.util.UUID.randomUUID().toString();
        dto.origin = create.origin;
        dto.destinationSedeId = create.destinationSedeId;
        dto.dateTime = create.dateTime;
        dto.seatsTotal = create.seatsTotal;
        dto.seatsFree = create.seatsTotal;
        return Response.status(Response.Status.CREATED).entity(dto).build();
    }

    @GET
    public Response list(@QueryParam("destinationSedeId") String destinationSedeId,
                         @QueryParam("from") String from,
                         @QueryParam("to") String to) {
        List<TripDto> trips = new ArrayList<>();
        return Response.ok(trips).build();
    }
}
