package com.company.covoituraje.booking.api;

import com.company.covoituraje.booking.integration.TripsServiceClient;
import com.company.covoituraje.booking.integration.UsersServiceClient;
import com.company.covoituraje.booking.service.BookingValidationService;
import com.company.covoituraje.booking.infrastructure.BookingRepository;
import com.company.covoituraje.shared.dto.TripDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingResourceTest {

    private BookingResource resource;
    
    @Mock
    private TripsServiceClient tripsServiceClient;
    
    @Mock
    private UsersServiceClient usersServiceClient;

    @BeforeEach
    void setUp() {
        // Create resource with mocked services
        resource = new BookingResource();
        
        // Use reflection to inject mocked services (since BookingResource doesn't have setters)
        try {
            java.lang.reflect.Field validationServiceField = BookingResource.class.getDeclaredField("validationService");
            validationServiceField.setAccessible(true);
            BookingValidationService validationService = new BookingValidationService(tripsServiceClient, usersServiceClient);
            validationServiceField.set(resource, validationService);
        } catch (Exception e) {
            // Fallback: create a simple resource without validation for basic tests
        }
        
        // Set up test user context
        BookingResource.AuthContext.setUserId("test-user-001");
    }

    @Test
    void post_createsBooking() throws Exception {
        // Mock the validation calls
        when(usersServiceClient.userExists("test-user-001")).thenReturn(true);
        when(tripsServiceClient.hasAvailableSeats(anyString(), anyInt())).thenReturn(true);
        
        BookingResource.BookingCreateDto req = new BookingResource.BookingCreateDto();
        req.tripId = "550e8400-e29b-41d4-a716-446655440001"; // Use real trip ID from seed data
        req.seatsRequested = 1;
        
        BookingDto dto = resource.create(req);
        
        assertNotNull(dto.id);
        assertEquals(req.tripId, dto.tripId);
        assertEquals("test-user-001", dto.passengerId);
        assertEquals(1, dto.seatsRequested);
        assertEquals("PENDING", dto.status);
        
        // Verify validation calls were made
        verify(usersServiceClient).userExists("test-user-001");
        verify(tripsServiceClient).hasAvailableSeats(eq(req.tripId), eq(1));
    }

    @Test
    void get_returnsList() {
        List<BookingDto> list = resource.listMine();
        assertNotNull(list);
        // Should be empty initially for test user
        assertTrue(list.isEmpty());
    }
}
