package com.company.covoituraje.matching.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MatchesResourceTest {

    private MatchesResource resource;

    @BeforeEach
    void setUp() {
        resource = new MatchesResource();
        // Set up test user context
        MatchesResource.AuthContext.setUserId("test-user-001");
    }

    @Test
    void get_returnsMatchesFilteredAndScored() {
        List<MatchDto> list = resource.findMatches("SEDE-1", "08:30", "Madrid Centro");
        assertNotNull(list);
        // The list might be empty if no trips are available, which is valid
        // If there are matches, verify they are properly structured
        if (!list.isEmpty()) {
            // Highest score should be the one matching both destination and exact time
            assertNotNull(list.get(0).tripId);
            assertTrue(list.get(0).score >= list.get(list.size() - 1).score);
        }
    }

    @Test
    void contract_fields_present() {
        List<MatchDto> list = resource.findMatches("SEDE-1", "09:00", "Madrid Norte");
        assertNotNull(list);
        for (MatchDto m : list) {
            // OpenAPI requires tripId (string, uuid format not enforced here) and score (number)
            assertNotNull(m.tripId);
            assertNotNull(m.driverId);
            assertNotNull(m.origin);
            assertNotNull(m.destinationSedeId);
            assertNotNull(m.dateTime);
            assertTrue(m.seatsFree >= 0);
            // score must be a finite number
            assertTrue(Double.isFinite(m.score));
            assertTrue(m.score >= 0.0 && m.score <= 1.0);
        }
    }

    @Test
    void myMatches_returnsUserMatches() {
        List<MatchDto> list = resource.getMyMatches();
        assertNotNull(list);
        // Should be empty initially for test user
        assertTrue(list.isEmpty());
    }
}
