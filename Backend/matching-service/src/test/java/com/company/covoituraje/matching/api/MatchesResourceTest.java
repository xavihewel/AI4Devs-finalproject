package com.company.covoituraje.matching.api;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class MatchesResourceTest {

    @Test
    void get_returnsMatchesFilteredAndScored() {
        MatchesResource resource = new MatchesResource();
        List<MatchDto> list = resource.get("SEDE-1", "08:30");
        assertNotNull(list);
        assertFalse(list.isEmpty());
        // Highest score should be the one matching both destination and exact time
        assertEquals("TRIP-1", list.get(0).tripId);
        assertTrue(list.get(0).score >= list.get(list.size() - 1).score);
    }

    @Test
    void contract_fields_present() {
        MatchesResource resource = new MatchesResource();
        List<MatchDto> list = resource.get("SEDE-1", "09:00");
        assertNotNull(list);
        for (MatchDto m : list) {
            // OpenAPI requires tripId (string, uuid format not enforced here) and score (number)
            assertNotNull(m.tripId);
            // score must be a finite number
            assertTrue(Double.isFinite(m.score));
        }
    }
}
