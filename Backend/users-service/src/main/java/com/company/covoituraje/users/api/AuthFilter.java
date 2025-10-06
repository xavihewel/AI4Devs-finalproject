package com.company.covoituraje.users.api;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import com.company.covoituraje.auth.JwtValidator;
import com.company.covoituraje.auth.JwtValidationException;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {
    private final JwtValidator jwtValidator;

    public AuthFilter() {
        String issuer = System.getenv("OIDC_ISSUER_URI");
        String jwks = System.getenv("OIDC_JWKS_URI");
        this.jwtValidator = new JwtValidator(issuer, jwks);
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        String auth = requestContext.getHeaderString("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }
        String token = auth.substring("Bearer ".length());
        try {
            jwtValidator.validate(token);
            // NOTE: JwtValidator already checks 'sub' exists. Extract and set into context for downstream use.
            String userId = com.nimbusds.jwt.SignedJWT.parse(token).getJWTClaimsSet().getSubject();
            requestContext.setProperty("userId", userId);
        } catch (JwtValidationException | java.text.ParseException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build());
        }
    }
}
