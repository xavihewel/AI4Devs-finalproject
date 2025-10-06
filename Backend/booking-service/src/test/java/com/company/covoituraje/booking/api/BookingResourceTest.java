package com.company.covoituraje.booking.api;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class BookingResourceTest {

    @Test
    void post_createsBooking() {
        BookingResource resource = new BookingResource();
        BookingResource.BookingCreate req = new BookingResource.BookingCreate();
        req.tripId = "TRIP-1";
        BookingDto dto = resource.create(req);
        assertNotNull(dto.id);
        assertEquals("TRIP-1", dto.tripId);
        assertEquals("CONFIRMED", dto.status);
    }

    @Test
    void get_returnsList() {
        BookingResource resource = new BookingResource();
        List<BookingDto> list = resource.listMine();
        assertNotNull(list);
        assertTrue(list.isEmpty());
    }
}
