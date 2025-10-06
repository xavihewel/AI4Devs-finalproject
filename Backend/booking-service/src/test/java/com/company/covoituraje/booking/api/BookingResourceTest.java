package com.company.covoituraje.booking.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BookingResourceTest {

    private BookingResource resource;

    @BeforeEach
    void setUp() {
        resource = new BookingResource();
        // Set up test user context
        BookingResource.AuthContext.setUserId("test-user-001");
    }

    @Test
    void post_createsBooking() {
        BookingResource.BookingCreateDto req = new BookingResource.BookingCreateDto();
        req.tripId = "550e8400-e29b-41d4-a716-446655440001"; // Use real trip ID from seed data
        req.seatsRequested = 1;
        
        BookingDto dto = resource.create(req);
        
        assertNotNull(dto.id);
        assertEquals(req.tripId, dto.tripId);
        assertEquals("test-user-001", dto.passengerId);
        assertEquals(1, dto.seatsRequested);
        assertEquals("PENDING", dto.status);
    }

    @Test
    void get_returnsList() {
        List<BookingDto> list = resource.listMine();
        assertNotNull(list);
        // Should be empty initially for test user
        assertTrue(list.isEmpty());
    }
}
