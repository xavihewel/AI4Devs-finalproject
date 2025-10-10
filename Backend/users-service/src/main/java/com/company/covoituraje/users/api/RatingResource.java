package com.company.covoituraje.users.api;

import com.company.covoituraje.users.domain.Rating;
import com.company.covoituraje.users.service.RatingService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/ratings")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RatingResource {
    
    private final RatingService ratingService;
    
    public RatingResource(RatingService ratingService) {
        this.ratingService = ratingService;
    }
    
    /**
     * Create a new rating
     */
    @POST
    public RatingDto createRating(RatingCreateDto createDto) {
        String currentUserId = AuthContext.getUserId();
        if (currentUserId == null || currentUserId.isBlank()) {
            throw new BadRequestException("User ID is required");
        }
        
        Rating rating = ratingService.createRating(createDto, currentUserId);
        return new RatingDto(rating);
    }
    
    /**
     * Handle OPTIONS requests for CORS
     */
    @OPTIONS
    public void handleOptions() {
        // CORS headers are handled by the filter
    }
    
    /**
     * Get ratings given by current user
     */
    @GET
    @Path("/my-ratings")
    public List<RatingDto> getMyRatings() {
        String currentUserId = AuthContext.getUserId();
        if (currentUserId == null || currentUserId.isBlank()) {
            throw new BadRequestException("User ID is required");
        }
        
        List<Rating> ratings = ratingService.getRatingsByRater(currentUserId);
        return ratings.stream()
            .map(RatingDto::new)
            .toList();
    }
    
    /**
     * Get ratings received by a specific user
     */
    @GET
    @Path("/user/{userId}")
    public List<RatingDto> getRatingsForUser(@PathParam("userId") String userId) {
        List<Rating> ratings = ratingService.getRatingsByRated(userId);
        return ratings.stream()
            .map(RatingDto::new)
            .toList();
    }
    
    /**
     * Get trust score for a user
     */
    @GET
    @Path("/user/{userId}/trust-score")
    public double getTrustScore(@PathParam("userId") String userId) {
        return ratingService.getTrustScore(userId);
    }
    
    /**
     * Get trust statistics for a user
     */
    @GET
    @Path("/user/{userId}/trust-stats")
    public RatingService.TrustStats getTrustStats(@PathParam("userId") String userId) {
        return ratingService.getTrustStats(userId);
    }
    
    /**
     * Simple AuthContext for testing
     */
    public static class AuthContext {
        private static final ThreadLocal<String> userId = new ThreadLocal<>();
        
        public static void setUserId(String id) {
            userId.set(id);
        }
        
        public static String getUserId() {
            return userId.get();
        }
        
        public static void clear() {
            userId.remove();
        }
    }
}
