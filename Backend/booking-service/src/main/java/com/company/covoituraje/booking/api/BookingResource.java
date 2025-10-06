package com.company.covoituraje.booking.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.UUID;

@Path("/bookings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookingResource {

    private final BookingRepository repository = new BookingRepository();

    @POST
    public BookingDto create(BookingCreate request) {
        BookingDto dto = new BookingDto();
        dto.id = UUID.randomUUID().toString();
        dto.tripId = request.tripId;
        dto.passengerId = UUID.randomUUID().toString();
        dto.status = "CONFIRMED";
        return repository.save(dto);
    }

    @GET
    public List<BookingDto> listMine() {
        return repository.listMine(null);
    }

    public static class BookingCreate {
        public String tripId;
    }
}
