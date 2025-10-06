package com.company.covoituraje.auth;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class JwtValidatorTest {

    private JwtValidator jwtValidator;

    @BeforeEach
    void setUp() {
        // issuer and jwks endpoints are placeholders for tests; real values would be injected
        jwtValidator = new JwtValidator("http://localhost:8080/realms/covoituraje-dev", "http://localhost:8080/realms/covoituraje-dev/protocol/openid-connect/certs");
    }

    @Test
    void acceptsValidJwt() {
        String token = "<valid.jwt.token>";
        assertDoesNotThrow(() -> jwtValidator.validate(token));
    }

    @Test
    void rejectsWrongIssuer() {
        String token = "<wrong.issuer.jwt>";
        JwtValidationException ex = assertThrows(JwtValidationException.class, () -> jwtValidator.validate(token));
        assertTrue(ex.getMessage().toLowerCase().contains("issuer"));
    }

    @Test
    void rejectsExpiredToken() {
        String token = "<expired.jwt>";
        JwtValidationException ex = assertThrows(JwtValidationException.class, () -> jwtValidator.validate(token));
        assertTrue(ex.getMessage().toLowerCase().contains("expired"));
    }

    @Test
    void rejectsNotBeforeInFuture() {
        String token = "<nbf.future.jwt>";
        JwtValidationException ex = assertThrows(JwtValidationException.class, () -> jwtValidator.validate(token));
        assertTrue(ex.getMessage().toLowerCase().contains("not before"));
    }

    @Test
    void rejectsMissingSubject() {
        String token = "<missing.sub.jwt>";
        JwtValidationException ex = assertThrows(JwtValidationException.class, () -> jwtValidator.validate(token));
        assertTrue(ex.getMessage().toLowerCase().contains("sub"));
    }

    @Test
    void audienceMustContainBackendApi() {
        String token = "<aud.invalid.jwt>";
        JwtValidationException ex = assertThrows(JwtValidationException.class, () -> jwtValidator.validate(token));
        assertTrue(ex.getMessage().toLowerCase().contains("aud"));
    }
}
