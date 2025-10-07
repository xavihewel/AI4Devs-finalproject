package com.company.covoituraje.matching.api;

import com.company.covoituraje.matching.service.MatchingService;
import com.company.covoituraje.matching.infrastructure.MatchRepository;
import com.company.covoituraje.matching.integration.TripsServiceClient;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

@Path("/matches")
@Produces(MediaType.APPLICATION_JSON)
public class MatchesResource {

    private final MatchingService matchingService;
    
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    public MatchesResource() {
        // Get trips service URL from environment variable
        String tripsServiceUrl = System.getenv("TRIPS_SERVICE_URL");
        if (tripsServiceUrl == null || tripsServiceUrl.isBlank()) {
            tripsServiceUrl = "http://localhost:8081"; // Default fallback
        }
        
        MatchRepository matchRepository = new MatchRepository();
        TripsServiceClient tripsServiceClient = new TripsServiceClient(tripsServiceUrl);
        this.matchingService = new MatchingService(matchRepository, tripsServiceClient);
    }

    @GET
    public List<MatchDto> findMatches(@QueryParam("destinationSedeId") String destinationSedeId,
                                     @QueryParam("time") String time,
                                     @QueryParam("origin") String origin) {
        
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // Validate required parameters
        if (destinationSedeId == null || destinationSedeId.isBlank()) {
            throw new BadRequestException("Destination sede ID is required");
        }

        // Use the matching service to find real matches
        List<MatchResult> matches = matchingService.findMatches(
            currentUser, 
            destinationSedeId, 
            time, 
            origin
        );

        // Convert to DTOs
        return matches.stream()
                .map(this::mapToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @GET
    @Path("/my-matches")
    public List<MatchDto> getMyMatches() {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // Get matches from database for this user
        MatchRepository repository = new MatchRepository();
        List<com.company.covoituraje.matching.domain.Match> matches = repository.findByPassengerId(currentUser);

        return matches.stream()
                .map(this::mapDomainToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @GET
    @Path("/driver/{driverId}")
    public List<MatchDto> getDriverMatches(@PathParam("driverId") String driverId) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        // For now, only allow users to see their own matches
        // In the future, drivers should be able to see matches for their trips
        if (!currentUser.equals(driverId)) {
            throw new ForbiddenException("Access denied");
        }

        MatchRepository repository = new MatchRepository();
        List<com.company.covoituraje.matching.domain.Match> matches = repository.findByDriverId(driverId);

        return matches.stream()
                .map(this::mapDomainToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    private MatchDto mapToDto(MatchResult matchResult) {
        MatchDto dto = new MatchDto();
        dto.tripId = matchResult.tripId;
        dto.driverId = matchResult.driverId;
        dto.origin = matchResult.origin;
        dto.destinationSedeId = matchResult.destinationSedeId;
        dto.dateTime = matchResult.dateTime;
        dto.seatsFree = matchResult.seatsFree;
        dto.score = matchResult.score;
        dto.reasons = matchResult.reasons;
        return dto;
    }

    private MatchDto mapDomainToDto(com.company.covoituraje.matching.domain.Match match) {
        MatchDto dto = new MatchDto();
        dto.tripId = match.getTripId().toString();
        dto.driverId = match.getDriverId();
        dto.score = match.getMatchScore().doubleValue();
        dto.status = match.getStatus();
        return dto;
    }
}
