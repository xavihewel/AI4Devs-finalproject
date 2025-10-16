package com.company.covoituraje.notification.service;

import com.company.covoituraje.shared.i18n.MessageService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.Locale;
import java.util.Map;

/**
 * Simple template engine adapter over MessageService.
 * Follows DIP by exposing a small interface and delegating to MessageService.
 */
@ApplicationScoped
public class TemplateEngine {

    @Inject
    MessageService messageService;

    public String render(String key, Map<String, Object> vars, Locale locale) {
        // MessageService supports positional arguments; adapt map to ordered values if needed.
        // For simplicity, pass common keys in order if present.
        Object tripId = vars != null ? vars.get("tripId") : null;
        Object seats = vars != null ? vars.get("seats") : null;

        if (tripId != null && seats != null) {
            return messageService.getMessage(key, locale, tripId, seats);
        } else if (tripId != null) {
            return messageService.getMessage(key, locale, tripId);
        } else if (seats != null) {
            return messageService.getMessage(key, locale, seats);
        }
        return messageService.getMessage(key, locale);
    }
}


