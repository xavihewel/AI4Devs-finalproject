package com.company.covoituraje.users.api;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import com.company.covoituraje.auth.JwtValidator;
import com.company.covoituraje.auth.JwtValidationException;
import com.company.covoituraje.auth.AuthUtils;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthFilter implements ContainerRequestFilter {
    private final JwtValidator jwtValidator;
    private final boolean requireEmployeeRole;

    public AuthFilter() {
        String issuer = System.getenv("OIDC_ISSUER_URI");
        String jwks = System.getenv("OIDC_JWKS_URI");
        this.jwtValidator = new JwtValidator(issuer, jwks);
        String require = System.getenv("REQUIRE_ROLE_EMPLOYEE");
        this.requireEmployeeRole = "true".equalsIgnoreCase(require);
    }

    // Injectable constructor for tests
    public AuthFilter(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
        this.requireEmployeeRole = false;
    }

    // Injectable constructor for tests with role flag
    public AuthFilter(JwtValidator jwtValidator, boolean requireEmployeeRole) {
        this.jwtValidator = jwtValidator;
        this.requireEmployeeRole = requireEmployeeRole;
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
            String userId = AuthUtils.extractUserIdFromToken(token);
            requestContext.setProperty("userId", userId);
            if (requireEmployeeRole) {
                java.util.List<String> roles = AuthUtils.extractRealmRoles(token);
                if (roles == null || roles.stream().noneMatch("EMPLOYEE"::equals)) {
                    requestContext.abortWith(Response.status(Response.Status.FORBIDDEN).entity("Forbidden").build());
                    return;
                }
            }
        } catch (JwtValidationException e) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).entity("Invalid token").build());
        }
    }
}
