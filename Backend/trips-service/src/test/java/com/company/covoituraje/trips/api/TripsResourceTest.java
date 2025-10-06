package com.company.covoituraje.trips.api;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TripsResourceTest {

    @Test
    void post_createsTripAndReturnsEntity() {
        TripsResource resource = new TripsResource();
        TripCreateDto create = new TripCreateDto();
        create.destinationSedeId = "SEDE-1";
        create.dateTime = "2025-10-06T08:30:00Z";
        create.seatsTotal = 3;
        TripDto.Origin origin = new TripDto.Origin();
        origin.lat = 41.0; origin.lng = 2.0;
        create.origin = origin;

        TripDto body = resource.create(create);
        assertEquals("SEDE-1", body.destinationSedeId);
        assertEquals(3, body.seatsTotal);
        assertEquals(3, body.seatsFree);
        assertNotNull(body.id);
    }

    @Test
    void get_returnsList() {
        TripsResource resource = new TripsResource();
        List<TripDto> list = resource.list("SEDE-1", "08:00", "09:00");
        assertNotNull(list);
        assertFalse(list.isEmpty());
        for (TripDto t : list) {
            assertEquals("SEDE-1", t.destinationSedeId);
        }
    }
}
