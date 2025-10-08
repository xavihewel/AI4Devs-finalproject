package com.company.covoituraje.matching.api;

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

    public AuthFilter(JwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
        this.requireEmployeeRole = false;
    }

    public AuthFilter(JwtValidator jwtValidator, boolean requireEmployeeRole) {
        this.jwtValidator = jwtValidator;
        this.requireEmployeeRole = requireEmployeeRole;
    }

    @Override
    public void filter(ContainerRequestContext requestContext) {
        // Allow OPTIONS requests (CORS preflight) to pass without authentication
        String method = requestContext.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return;
        }
        
        var uriInfo = requestContext.getUriInfo();
        String path = uriInfo != null ? uriInfo.getPath() : null;
        if (path != null && (path.equals("health") || path.equals("/health") || path.equals("api/health"))) {
            return;
        }
        String auth = requestContext.getHeaderString("Authorization");
        if (auth == null || !auth.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED).build());
            return;
        }
        String token = auth.substring("Bearer ".length());
        try {
            jwtValidator.validate(token);
            
            // Extract user info and set in context
            String userId = AuthUtils.extractUserIdFromToken(token);
            if (userId != null && !userId.isBlank()) {
                MatchesResource.AuthContext.setUserId(userId);
            }
            
            // Check employee role if required
            if (requireEmployeeRole) {
                var roles = AuthUtils.extractRealmRoles(token);
                if (!roles.contains("EMPLOYEE")) {
                    requestContext.abortWith(Response.status(403).build());
                    return;
                }
            }
            
        } catch (JwtValidationException e) {
            requestContext.abortWith(Response.status(401).build());
        }
    }
}
