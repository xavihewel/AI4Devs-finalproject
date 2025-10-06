package com.company.covoituraje.auth;

public class JwtValidator {
    private final String issuer;
    private final String jwksUri;

    public JwtValidator(String issuer, String jwksUri) {
        this.issuer = issuer;
        this.jwksUri = jwksUri;
    }

    public void validate(String token) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
