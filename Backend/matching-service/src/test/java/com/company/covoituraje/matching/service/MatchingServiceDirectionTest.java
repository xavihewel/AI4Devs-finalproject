package com.company.covoituraje.matching.service;

import com.company.covoituraje.matching.api.MatchResult;
import com.company.covoituraje.matching.infrastructure.MatchRepository;
import com.company.covoituraje.matching.integration.TripsServiceClient;
import com.company.covoituraje.shared.dto.TripDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class MatchingServiceDirectionTest {

    private MatchingService matchingService;
    private MatchRepository mockRepository;
    private TripsServiceClient mockTripsClient;

    @BeforeEach
    void setUp() {
        mockRepository = Mockito.mock(MatchRepository.class);
        mockTripsClient = Mockito.mock(TripsServiceClient.class);
        matchingService = new MatchingService(mockRepository, mockTripsClient);
    }

    @Test
    void shouldMatchTripsWithSameDirection() {
        // Given
        String passengerId = "passenger-123";
        String destinationSedeId = "SEDE-1";
        String preferredTime = "09:00";
        String originLocation = "Madrid Centro";
        String direction = "TO_SEDE";

        TripDto trip = createTripDto("trip-1", "driver-1", 40.4168, -3.7038, "SEDE-1", 
                                   "2024-01-15T09:00:00+01:00", 4, 2, "TO_SEDE", null);
        
        when(mockTripsClient.getAvailableTrips(destinationSedeId))
            .thenReturn(Arrays.asList(trip));

        // When
        List<MatchResult> matches = matchingService.findMatches(passengerId, destinationSedeId, 
                                                               preferredTime, originLocation, direction);

        // Then
        assertFalse(matches.isEmpty());
        MatchResult match = matches.get(0);
        assertEquals("TO_SEDE", match.direction);
        assertTrue(match.score > 0.0);
    }

    @Test
    void shouldNotMatchTripsWithOppositeDirection() {
        // Given
        String passengerId = "passenger-123";
        String destinationSedeId = "SEDE-1";
        String preferredTime = "09:00";
        String originLocation = "Madrid Centro";
        String direction = "TO_SEDE";

        TripDto trip = createTripDto("trip-1", "driver-1", 40.4168, -3.7038, "SEDE-1", 
                                   "2024-01-15T09:00:00+01:00", 4, 2, "FROM_SEDE", null);
        
        when(mockTripsClient.getAvailableTrips(destinationSedeId))
            .thenReturn(Arrays.asList(trip));

        // When
        List<MatchResult> matches = matchingService.findMatches(passengerId, destinationSedeId, 
                                                               preferredTime, originLocation, direction);

        // Then
        assertTrue(matches.isEmpty());
    }

    @Test
    void shouldPrioritizePairedTrips() {
        // Given
        String passengerId = "passenger-123";
        String destinationSedeId = "SEDE-1";
        String preferredTime = "09:00";
        String originLocation = "Madrid Centro";
        String direction = "TO_SEDE";

        TripDto regularTrip = createTripDto("trip-1", "driver-1", 40.4168, -3.7038, "SEDE-1", 
                                          "2024-01-15T09:00:00+01:00", 4, 2, "TO_SEDE", null);
        TripDto pairedTrip = createTripDto("trip-2", "driver-2", 40.4168, -3.7038, "SEDE-1", 
                                         "2024-01-15T09:00:00+01:00", 4, 2, "TO_SEDE", "trip-3");
        
        when(mockTripsClient.getAvailableTrips(destinationSedeId))
            .thenReturn(Arrays.asList(regularTrip, pairedTrip));

        // When
        List<MatchResult> matches = matchingService.findMatches(passengerId, destinationSedeId, 
                                                               preferredTime, originLocation, direction);

        // Then
        assertEquals(2, matches.size());
        // Paired trip should have higher score due to bonus
        assertTrue(matches.get(0).score >= matches.get(1).score);
        assertEquals("trip-2", matches.get(0).tripId);
        assertEquals("trip-3", matches.get(0).pairedTripId);
    }

    @Test
    void shouldIncludeDirectionInMatchReasons() {
        // Given
        String passengerId = "passenger-123";
        String destinationSedeId = "SEDE-1";
        String preferredTime = "09:00";
        String originLocation = "Madrid Centro";
        String direction = "TO_SEDE";

        TripDto trip = createTripDto("trip-1", "driver-1", 40.4168, -3.7038, "SEDE-1", 
                                   "2024-01-15T09:00:00+01:00", 4, 2, "TO_SEDE", null);
        
        when(mockTripsClient.getAvailableTrips(destinationSedeId))
            .thenReturn(Arrays.asList(trip));

        // When
        List<MatchResult> matches = matchingService.findMatches(passengerId, destinationSedeId, 
                                                               preferredTime, originLocation, direction);

        // Then
        assertFalse(matches.isEmpty());
        MatchResult match = matches.get(0);
        assertTrue(match.reasons.contains("Direction match: TO_SEDE"));
    }

    private TripDto createTripDto(String id, String driverId, double lat, double lng, String destinationSedeId,
                                 String dateTime, int seatsTotal, int seatsFree, String direction, String pairedTripId) {
        TripDto trip = new TripDto();
        trip.id = id;
        trip.driverId = driverId;
        trip.origin = new TripDto.Origin();
        trip.origin.lat = lat;
        trip.origin.lng = lng;
        trip.destinationSedeId = destinationSedeId;
        trip.dateTime = dateTime;
        trip.seatsTotal = seatsTotal;
        trip.seatsFree = seatsFree;
        trip.direction = direction;
        trip.pairedTripId = pairedTripId;
        return trip;
    }
}
