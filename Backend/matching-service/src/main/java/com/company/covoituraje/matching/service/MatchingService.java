package com.company.covoituraje.matching.service;

import com.company.covoituraje.matching.domain.Match;
import com.company.covoituraje.matching.infrastructure.MatchRepository;
import com.company.covoituraje.matching.api.TripInfo;
import com.company.covoituraje.matching.api.MatchResult;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class MatchingService {
    
    private final MatchRepository matchRepository;
    
    public MatchingService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }
    
    public List<MatchResult> findMatches(String passengerId, String destinationSedeId, 
                                       String preferredTime, String originLocation) {
        
        // For now, we'll use mock trip data since we don't have service-to-service communication yet
        // In a real implementation, this would call the trips-service API
        List<TripInfo> availableTrips = getAvailableTrips(destinationSedeId);
        
        List<MatchResult> matches = new ArrayList<>();
        
        for (TripInfo trip : availableTrips) {
            if (trip.seatsFree <= 0) continue; // Skip trips with no available seats
            
            double score = calculateMatchScore(trip, destinationSedeId, preferredTime, originLocation);
            
            if (score > 0.0) { // Only include trips with some compatibility
                MatchResult match = new MatchResult();
                match.tripId = trip.id;
                match.driverId = trip.driverId;
                match.origin = trip.origin;
                match.destinationSedeId = trip.destinationSedeId;
                match.dateTime = trip.dateTime;
                match.seatsFree = trip.seatsFree;
                match.score = score;
                match.reasons = getMatchReasons(trip, destinationSedeId, preferredTime, originLocation, score);
                
                matches.add(match);
            }
        }
        
        // Sort by score (highest first)
        matches.sort((a, b) -> Double.compare(b.score, a.score));
        
        // Save matches to database for tracking
        saveMatchesToDatabase(passengerId, matches);
        
        return matches;
    }
    
    private List<TripInfo> getAvailableTrips(String destinationSedeId) {
        // Mock data based on our seed data
        // In production, this would be an HTTP call to trips-service
        List<TripInfo> trips = new ArrayList<>();
        
        // Mock trips from seed data
        trips.add(createMockTrip("550e8400-e29b-41d4-a716-446655440001", "user-001", "Madrid Centro", "SEDE-1", "2025-10-06T08:30:00+00", 3, 3));
        trips.add(createMockTrip("550e8400-e29b-41d4-a716-446655440002", "user-002", "Madrid Norte", "SEDE-1", "2025-10-06T09:00:00+00", 2, 2));
        trips.add(createMockTrip("550e8400-e29b-41d4-a716-446655440003", "user-003", "Madrid Sur", "SEDE-2", "2025-10-06T08:30:00+00", 4, 4));
        trips.add(createMockTrip("550e8400-e29b-41d4-a716-446655440004", "user-004", "Madrid Este", "SEDE-1", "2025-10-07T08:30:00+00", 2, 1));
        trips.add(createMockTrip("550e8400-e29b-41d4-a716-446655440005", "user-005", "Madrid Oeste", "SEDE-2", "2025-10-07T09:00:00+00", 3, 3));
        
        // Filter by destination if specified
        if (destinationSedeId != null) {
            trips = trips.stream()
                    .filter(trip -> destinationSedeId.equals(trip.destinationSedeId))
                    .collect(Collectors.toList());
        }
        
        return trips;
    }
    
    private TripInfo createMockTrip(String id, String driverId, String origin, String destinationSedeId, 
                                   String dateTime, int seatsTotal, int seatsFree) {
        TripInfo trip = new TripInfo();
        trip.id = id;
        trip.driverId = driverId;
        trip.origin = origin;
        trip.destinationSedeId = destinationSedeId;
        trip.dateTime = dateTime;
        trip.seatsTotal = seatsTotal;
        trip.seatsFree = seatsFree;
        return trip;
    }
    
    private double calculateMatchScore(TripInfo trip, String destinationSedeId, 
                                    String preferredTime, String originLocation) {
        double score = 0.0;
        
        // 1. Destination match (40% weight)
        if (destinationSedeId != null && destinationSedeId.equals(trip.destinationSedeId)) {
            score += 0.4;
        }
        
        // 2. Time compatibility (30% weight)
        if (preferredTime != null) {
            double timeScore = calculateTimeScore(trip.dateTime, preferredTime);
            score += timeScore * 0.3;
        }
        
        // 3. Origin proximity (20% weight)
        if (originLocation != null) {
            double locationScore = calculateLocationScore(trip.origin, originLocation);
            score += locationScore * 0.2;
        }
        
        // 4. Availability bonus (10% weight)
        if (trip.seatsFree > 0) {
            double availabilityScore = Math.min(1.0, trip.seatsFree / 4.0); // Max score for 4+ seats
            score += availabilityScore * 0.1;
        }
        
        return Math.min(1.0, score); // Cap at 1.0
    }
    
    private double calculateTimeScore(String tripTime, String preferredTime) {
        try {
            // Parse times (simplified - assumes HH:mm format for preferredTime)
            OffsetDateTime tripDateTime = OffsetDateTime.parse(tripTime, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
            int tripHour = tripDateTime.getHour();
            int tripMinute = tripDateTime.getMinute();
            int tripMinutes = tripHour * 60 + tripMinute;
            
            String[] preferredParts = preferredTime.split(":");
            int preferredHour = Integer.parseInt(preferredParts[0]);
            int preferredMinute = Integer.parseInt(preferredParts[1]);
            int preferredMinutes = preferredHour * 60 + preferredMinute;
            
            int timeDiff = Math.abs(tripMinutes - preferredMinutes);
            
            if (timeDiff <= 15) return 1.0;      // Perfect match
            if (timeDiff <= 30) return 0.8;      // Good match
            if (timeDiff <= 60) return 0.5;      // Acceptable match
            if (timeDiff <= 120) return 0.2;     // Poor match
            return 0.0;                          // No match
            
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    private double calculateLocationScore(String tripOrigin, String userOrigin) {
        // Simplified location matching based on Madrid districts
        // In production, this would use real geocoding and distance calculation
        
        if (tripOrigin.equalsIgnoreCase(userOrigin)) {
            return 1.0; // Same location
        }
        
        // Define proximity groups
        Map<String, List<String>> proximityGroups = new HashMap<>();
        proximityGroups.put("north", Arrays.asList("Madrid Norte", "Madrid Centro"));
        proximityGroups.put("south", Arrays.asList("Madrid Sur", "Madrid Centro"));
        proximityGroups.put("east", Arrays.asList("Madrid Este", "Madrid Centro"));
        proximityGroups.put("west", Arrays.asList("Madrid Oeste", "Madrid Centro"));
        proximityGroups.put("center", Arrays.asList("Madrid Centro", "Madrid Norte", "Madrid Sur", "Madrid Este", "Madrid Oeste"));
        
        // Check if origins are in the same proximity group
        for (List<String> group : proximityGroups.values()) {
            if (group.contains(tripOrigin) && group.contains(userOrigin)) {
                return 0.7; // Same proximity group
            }
        }
        
        return 0.3; // Different areas but still in Madrid
    }
    
    private List<String> getMatchReasons(TripInfo trip, String destinationSedeId, 
                                       String preferredTime, String originLocation, double score) {
        List<String> reasons = new ArrayList<>();
        
        if (destinationSedeId != null && destinationSedeId.equals(trip.destinationSedeId)) {
            reasons.add("Same destination");
        }
        
        if (preferredTime != null) {
            try {
                OffsetDateTime tripDateTime = OffsetDateTime.parse(trip.dateTime, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                String[] preferredParts = preferredTime.split(":");
                int preferredHour = Integer.parseInt(preferredParts[0]);
                int preferredMinute = Integer.parseInt(preferredParts[1]);
                
                int timeDiff = Math.abs(tripDateTime.getHour() * 60 + tripDateTime.getMinute() - 
                                      (preferredHour * 60 + preferredMinute));
                
                if (timeDiff <= 15) {
                    reasons.add("Perfect time match");
                } else if (timeDiff <= 30) {
                    reasons.add("Good time match");
                } else if (timeDiff <= 60) {
                    reasons.add("Acceptable time");
                }
            } catch (Exception e) {
                // Ignore time parsing errors
            }
        }
        
        if (trip.seatsFree >= 2) {
            reasons.add("Multiple seats available");
        }
        
        if (score >= 0.8) {
            reasons.add("High compatibility");
        }
        
        return reasons;
    }
    
    private void saveMatchesToDatabase(String passengerId, List<MatchResult> matches) {
        for (MatchResult match : matches) {
            try {
                UUID tripId = UUID.fromString(match.tripId);
                
                // Check if match already exists
                List<Match> existingMatches = matchRepository.findByTripIdAndPassengerId(tripId, passengerId);
                if (!existingMatches.isEmpty()) {
                    // Update existing match
                    Match existingMatch = existingMatches.get(0);
                    existingMatch.setMatchScore(BigDecimal.valueOf(match.score));
                    existingMatch.setUpdatedAt(OffsetDateTime.now());
                    matchRepository.save(existingMatch);
                } else {
                    // Create new match
                    Match newMatch = new Match(tripId, passengerId, match.driverId, 
                                             BigDecimal.valueOf(match.score), "PENDING");
                    matchRepository.save(newMatch);
                }
            } catch (Exception e) {
                // Log error but continue processing
                System.err.println("Error saving match: " + e.getMessage());
            }
        }
    }
}
