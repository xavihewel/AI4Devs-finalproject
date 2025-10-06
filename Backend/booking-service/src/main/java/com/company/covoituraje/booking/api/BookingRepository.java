package com.company.covoituraje.booking.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BookingRepository {
    private static final List<BookingDto> BOOKINGS = new ArrayList<>();

    public List<BookingDto> listMine(String passengerId) {
        if (passengerId == null || passengerId.isBlank()) {
            return Collections.unmodifiableList(BOOKINGS);
        }
        List<BookingDto> mine = new ArrayList<>();
        for (BookingDto b : BOOKINGS) {
            if (passengerId.equals(b.passengerId)) {
                mine.add(b);
            }
        }
        return Collections.unmodifiableList(mine);
    }

    public BookingDto save(BookingDto dto) {
        BOOKINGS.add(dto);
        return dto;
    }
}
