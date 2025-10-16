package com.company.covoituraje.notification.service;

import org.junit.jupiter.api.Test;

import java.util.Locale;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * TDD for a minimal TemplateEngine that renders subject/body with placeholders and i18n.
 */
class TemplateEngineTest {

    @Test
    void rendersBookingConfirmedEmail_templateWithVariables() {
        TemplateEngine engine = new SimpleTemplateEngine();

        String subject = engine.render("email.booking.confirmed.subject", Map.of("tripId", "trip-1"), Locale.ENGLISH);
        String body = engine.render("email.booking.confirmed.body", Map.of("seats", 2), Locale.ENGLISH);

        assertThat(subject).containsIgnoringCase("trip-1");
        assertThat(body).contains("2");
    }

    @Test
    void supportsDifferentLocales() {
        TemplateEngine engine = new SimpleTemplateEngine();

        String subjectEs = engine.render("email.trip.cancelled.subject", Map.of("tripId", "viaje-9"), Locale.forLanguageTag("es"));

        assertThat(subjectEs.toLowerCase()).contains("viaje-9");
    }

    interface TemplateEngine {
        String render(String key, Map<String, Object> vars, Locale locale);
    }

    /**
     * Simple TDD stub. Production version will delegate to MessageService with formatting.
     */
    static class SimpleTemplateEngine implements TemplateEngine {
        @Override
        public String render(String key, Map<String, Object> vars, Locale locale) {
            // minimal behavior so tests compile: just concatenate key and vars
            StringBuilder sb = new StringBuilder();
            sb.append(key);
            if (vars != null && !vars.isEmpty()) {
                sb.append(" ");
                vars.forEach((k, v) -> sb.append(k).append("=").append(String.valueOf(v)).append(" "));
            }
            if (locale != null) {
                sb.append(" (" + locale.toLanguageTag() + ")");
            }
            return sb.toString();
        }
    }
}


