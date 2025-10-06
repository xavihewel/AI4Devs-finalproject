package com.company.covoituraje.trips.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TripsResourceTest {

    private TripsResource resource;

    @BeforeEach
    void setUp() {
        resource = new TripsResource();
        // Set up test user context
        TripsResource.AuthContext.setUserId("test-user-001");
    }

    @Test
    void post_createsTripAndReturnsEntity() {
        TripCreateDto create = new TripCreateDto();
        TripDto.Origin origin = new TripDto.Origin();
        origin.lat = 40.4168;
        origin.lng = -3.7038;
        create.origin = origin;
        create.destinationSedeId = "SEDE-1";
        create.dateTime = "2025-10-06T08:30:00+00:00";
        create.seatsTotal = 3;

        TripDto body = resource.create(create);
        assertEquals("SEDE-1", body.destinationSedeId);
        assertEquals(3, body.seatsTotal);
        assertEquals(3, body.seatsFree);
        assertNotNull(body.id);
        assertEquals("test-user-001", body.driverId);
    }

    @Test
    void get_returnsList() {
        List<TripDto> list = resource.list("SEDE-1", "08:00", "09:00");
        assertNotNull(list);
        // In test environment, the table is created empty (create-drop)
        // So we expect an empty list initially
        assertTrue(list.isEmpty());
    }
}
