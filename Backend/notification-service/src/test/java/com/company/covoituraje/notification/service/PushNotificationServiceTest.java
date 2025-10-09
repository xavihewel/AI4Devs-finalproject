package com.company.covoituraje.notification.service;

import com.company.covoituraje.notification.domain.NotificationSubscription;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class PushNotificationServiceTest {
    
    private PushNotificationService pushNotificationService;
    
    @BeforeEach
    void setUp() {
        pushNotificationService = new PushNotificationService();
    }
    
    @Test
    void shouldSendNotificationSuccessfully() {
        // Given
        NotificationSubscription subscription = new NotificationSubscription(
            "user-001",
            "https://fcm.googleapis.com/fcm/send/example",
            "p256dh-key",
            "auth-key"
        );
        
        String title = "Test Notification";
        String body = "This is a test notification";
        
        // When & Then
        assertDoesNotThrow(() -> {
            pushNotificationService.sendNotification(subscription, title, body);
        });
    }
    
    @Test
    void shouldHandleInvalidSubscription() {
        // Given
        NotificationSubscription invalidSubscription = new NotificationSubscription(
            "user-001",
            "invalid-endpoint",
            "invalid-key",
            "invalid-auth"
        );
        
        String title = "Test Notification";
        String body = "This is a test notification";
        
        // When & Then
        // Should not throw exception even with invalid subscription
        assertDoesNotThrow(() -> {
            pushNotificationService.sendNotification(invalidSubscription, title, body);
        });
    }
    
    @Test
    void shouldCreateValidPayload() {
        // Given
        String title = "Test Notification";
        String body = "This is a test notification";
        
        // When
        String payload = pushNotificationService.createPayload(title, body);
        
        // Then
        assertNotNull(payload);
        assertTrue(payload.contains(title));
        assertTrue(payload.contains(body));
        assertTrue(payload.contains("\"title\""));
        assertTrue(payload.contains("\"body\""));
    }
}
