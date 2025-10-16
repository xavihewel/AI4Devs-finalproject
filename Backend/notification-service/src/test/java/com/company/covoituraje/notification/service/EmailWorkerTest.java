package com.company.covoituraje.notification.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.util.Locale;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * TDD for EmailWorker: consumes domain events and delegates to NotificationService.
 * Follows SOLID via depending on the NotificationService abstraction for side-effects.
 */
class EmailWorkerTest {

    private NotificationService notificationService;
    private EmailWorker worker;

    @BeforeEach
    void setUp() {
        notificationService = Mockito.mock(NotificationService.class);
        worker = new EmailWorker(notificationService);
    }

    @Test
    void handlesBookingConfirmedEvent_andDelegatesToNotificationService() {
        BookingConfirmedEvent event = new BookingConfirmedEvent(
                "user-1",
                "user@example.com",
                "trip-123",
                2,
                Locale.ENGLISH
        );

        worker.handle(event);

        verify(notificationService, times(1))
                .sendBookingConfirmation("user-1", "user@example.com", "trip-123", 2, Locale.ENGLISH);
    }

    @Test
    void handlesTripCancelledEvent_andDelegatesToNotificationService() {
        TripCancelledEvent event = new TripCancelledEvent(
                "user-9",
                "driver@example.com",
                "trip-XYZ",
                Locale.forLanguageTag("es")
        );

        worker.handle(event);

        ArgumentCaptor<String> userCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> emailCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<String> tripCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<Locale> localeCaptor = ArgumentCaptor.forClass(Locale.class);

        verify(notificationService, times(1))
                .sendTripCancellation(userCaptor.capture(), emailCaptor.capture(), tripCaptor.capture(), localeCaptor.capture());

        assertThat(userCaptor.getValue()).isEqualTo("user-9");
        assertThat(emailCaptor.getValue()).isEqualTo("driver@example.com");
        assertThat(tripCaptor.getValue()).isEqualTo("trip-XYZ");
        assertThat(localeCaptor.getValue().toLanguageTag()).isEqualTo("es");
    }

    // --- Minimal domain event types for TDD ---
    interface NotificationEvent {}

    static final class BookingConfirmedEvent implements NotificationEvent {
        final String userId; final String email; final String tripId; final int seats; final Locale locale;
        BookingConfirmedEvent(String userId, String email, String tripId, int seats, Locale locale) {
            this.userId = userId; this.email = email; this.tripId = tripId; this.seats = seats; this.locale = locale;
        }
    }

    static final class TripCancelledEvent implements NotificationEvent {
        final String userId; final String email; final String tripId; final Locale locale;
        TripCancelledEvent(String userId, String email, String tripId, Locale locale) {
            this.userId = userId; this.email = email; this.tripId = tripId; this.locale = locale;
        }
    }

    /**
     * TDD stub for EmailWorker to compile tests; the production class will live in main sources.
     */
    static final class EmailWorker {
        private final NotificationService notificationService;
        EmailWorker(NotificationService notificationService) { this.notificationService = notificationService; }

        void handle(NotificationEvent event) {
            if (event instanceof BookingConfirmedEvent e) {
                notificationService.sendBookingConfirmation(e.userId, e.email, e.tripId, e.seats, e.locale);
            } else if (event instanceof TripCancelledEvent e) {
                notificationService.sendTripCancellation(e.userId, e.email, e.tripId, e.locale);
            }
        }
    }
}


