package com.company.covoituraje.booking.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BookingRepository {
    private static final List<BookingDto> BOOKINGS = new ArrayList<>();

    public List<BookingDto> listMine(String passengerId) {
        // For now, return all as we don't have auth context wiring
        return Collections.unmodifiableList(BOOKINGS);
    }

    public BookingDto save(BookingDto dto) {
        BOOKINGS.add(dto);
        return dto;
    }
}
