package com.company.covoituraje.notification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class EmailNotificationServiceTest {
    
    private EmailNotificationService emailNotificationService;
    
    @BeforeEach
    void setUp() {
        emailNotificationService = new EmailNotificationService();
    }
    
    @Test
    void shouldSendEmailSuccessfully() {
        // Given
        String email = "user@example.com";
        String subject = "Test Subject";
        String body = "Test email body";
        
        // When & Then
        assertDoesNotThrow(() -> {
            emailNotificationService.sendEmail(email, subject, body);
        });
    }
    
    @Test
    void shouldHandleInvalidEmail() {
        // Given
        String invalidEmail = "invalid-email";
        String subject = "Test Subject";
        String body = "Test email body";
        
        // When & Then
        // Should not throw exception, but might log error
        assertDoesNotThrow(() -> {
            emailNotificationService.sendEmail(invalidEmail, subject, body);
        });
    }
    
    @Test
    void shouldCreateBookingConfirmationEmail() {
        // Given
        String email = "user@example.com";
        String tripId = "trip-001";
        int seatsRequested = 2;
        
        // When & Then
        assertDoesNotThrow(() -> {
            emailNotificationService.sendBookingConfirmation(email, tripId, seatsRequested);
        });
    }
    
    @Test
    void shouldCreateTripCancellationEmail() {
        // Given
        String email = "user@example.com";
        String tripId = "trip-001";
        
        // When & Then
        assertDoesNotThrow(() -> {
            emailNotificationService.sendTripCancellation(email, tripId);
        });
    }
}
