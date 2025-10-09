package com.company.covoituraje.notification.service;

import com.company.covoituraje.notification.domain.NotificationSubscription;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.*;

class NotificationServiceTest {
    
    private NotificationService notificationService;
    
    @BeforeEach
    void setUp() {
        notificationService = new NotificationService();
    }
    
    @Test
    void shouldSubscribeUserToNotifications() {
        // Given
        String userId = "user-001";
        String endpoint = "https://fcm.googleapis.com/fcm/send/example";
        String p256dhKey = "p256dh-key";
        String authKey = "auth-key";
        
        // When & Then
        assertDoesNotThrow(() -> {
            NotificationSubscription result = notificationService.subscribeUser(userId, endpoint, p256dhKey, authKey);
            assertNotNull(result);
        });
    }
    
    @Test
    void shouldUpdateExistingSubscription() {
        // Given
        String userId = "user-001";
        String endpoint = "https://fcm.googleapis.com/fcm/send/example";
        String newP256dhKey = "new-p256dh-key";
        String newAuthKey = "new-auth-key";
        
        // When & Then
        assertDoesNotThrow(() -> {
            NotificationSubscription result = notificationService.subscribeUser(userId, endpoint, newP256dhKey, newAuthKey);
            assertNotNull(result);
        });
    }
    
    @Test
    void shouldUnsubscribeUser() {
        // Given
        String userId = "user-001";
        String endpoint = "https://fcm.googleapis.com/fcm/send/example";
        
        // When & Then
        assertDoesNotThrow(() -> {
            notificationService.unsubscribeUser(userId, endpoint);
        });
    }
    
    @Test
    void shouldSendPushNotificationToUser() {
        // Given
        String userId = "user-001";
        String title = "Nueva reserva";
        String body = "Tu reserva ha sido confirmada";
        
        // When & Then
        assertDoesNotThrow(() -> {
            notificationService.sendPushNotification(userId, title, body);
        });
    }
    
    @Test
    void shouldSendEmailNotification() {
        // Given
        String userId = "user-001";
        String email = "user@example.com";
        String subject = "Nueva reserva";
        String body = "Tu reserva ha sido confirmada";
        
        // When & Then
        assertDoesNotThrow(() -> {
            notificationService.sendEmailNotification(userId, email, subject, body);
        });
    }
    
    @Test
    void shouldSendBookingConfirmationNotification() {
        // Given
        String userId = "user-001";
        String email = "user@example.com";
        String tripId = "trip-001";
        int seatsRequested = 2;
        
        // When & Then
        assertDoesNotThrow(() -> {
            notificationService.sendBookingConfirmation(userId, email, tripId, seatsRequested);
        });
    }
}
