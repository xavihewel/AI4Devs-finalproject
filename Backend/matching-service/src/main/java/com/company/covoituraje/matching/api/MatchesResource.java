package com.company.covoituraje.matching.api;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Path("/matches")
@Produces(MediaType.APPLICATION_JSON)
public class MatchesResource {

    @GET
    public List<MatchDto> get(@QueryParam("destinationSedeId") String destinationSedeId,
                              @QueryParam("time") String time) {
        // Mock trips: three trips to different sedes and times
        List<MockTrip> trips = List.of(
                new MockTrip("TRIP-1", "SEDE-1", "08:30"),
                new MockTrip("TRIP-2", "SEDE-1", "09:00"),
                new MockTrip("TRIP-3", "SEDE-2", "08:30")
        );
        // Simple score: +1 if same destination, +0.5 if time equal, +0.25 if within 30m window
        return trips.stream()
                .filter(t -> destinationSedeId == null || destinationSedeId.equals(t.destinationSedeId))
                .map(t -> {
                    double s = 0.0;
                    if (destinationSedeId != null && destinationSedeId.equals(t.destinationSedeId)) s += 1.0;
                    if (time != null && time.equals(t.time)) s += 0.5;
                    if (time != null && isWithin30Minutes(time, t.time)) s += 0.25;
                    MatchDto m = new MatchDto();
                    m.tripId = t.id;
                    m.score = s;
                    return m;
                })
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private boolean isWithin30Minutes(String base, String other) {
        // times as HH:MM in same day; naive minutes diff
        try {
            String[] b = base.split(":");
            String[] o = other.split(":");
            int bm = Integer.parseInt(b[0]) * 60 + Integer.parseInt(b[1]);
            int om = Integer.parseInt(o[0]) * 60 + Integer.parseInt(o[1]);
            return Math.abs(bm - om) <= 30;
        } catch (Exception e) {
            return false;
        }
    }

    private static class MockTrip {
        final String id;
        final String destinationSedeId;
        final String time;
        MockTrip(String id, String destinationSedeId, String time) {
            this.id = id;
            this.destinationSedeId = destinationSedeId;
            this.time = time;
        }
    }
}
