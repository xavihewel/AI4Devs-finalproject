package com.company.covoituraje.booking.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.container.ContainerRequestContext;

import java.util.List;
import java.util.UUID;

@Path("/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    private final BookingRepository repository = new BookingRepository();
    @Context
    ContainerRequestContext requestContext;

    @POST
    public BookingDto create(BookingCreate request) {
        BookingDto dto = new BookingDto();
        dto.id = UUID.randomUUID().toString();
        dto.tripId = request.tripId;
        String userId = requestContext != null ? (String) requestContext.getProperty("userId") : null;
        if (userId == null || userId.isBlank()) {
            userId = UUID.randomUUID().toString();
        }
        dto.passengerId = userId;
        dto.status = "CONFIRMED";
        return repository.save(dto);
    }

    @GET
    public List<BookingDto> listMine() {
        String userId = requestContext != null ? (String) requestContext.getProperty("userId") : null;
        return repository.listMine(userId);
    }

    public static class BookingCreate {
        public String tripId;
    }
}
