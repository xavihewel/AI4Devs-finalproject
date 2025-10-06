package com.company.covoituraje.trips.api;

import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TripsResourceTest {

    @Test
    void post_createsTripAndReturns201() {
        TripsResource resource = new TripsResource();
        TripCreateDto create = new TripCreateDto();
        create.destinationSedeId = "SEDE-1";
        create.dateTime = "2025-10-06T08:30:00Z";
        create.seatsTotal = 3;
        TripDto.Origin origin = new TripDto.Origin();
        origin.lat = 41.0; origin.lng = 2.0;
        create.origin = origin;

        Response response = resource.create(create);
        assertEquals(201, response.getStatus());
        TripDto body = (TripDto) response.getEntity();
        assertEquals("SEDE-1", body.destinationSedeId);
        assertEquals(3, body.seatsTotal);
        assertEquals(3, body.seatsFree);
        assertNotNull(body.id);
    }

    @Test
    void get_returnsList() {
        TripsResource resource = new TripsResource();
        Response response = resource.list("SEDE-1", "08:00", "09:00");
        assertEquals(200, response.getStatus());
        assertTrue(response.getEntity() instanceof java.util.List);
    }
}
