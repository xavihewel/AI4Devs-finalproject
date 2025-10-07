package com.company.covoituraje.users.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {
    @GET
    public HealthResponse health() {
        HealthResponse r = new HealthResponse();
        r.status = "UP";
        r.service = "users-service";
        r.timestamp = System.currentTimeMillis();
        return r;
    }

    public static class HealthResponse {
        public String status;
        public String service;
        public long timestamp;
    }
}

package com.company.covoituraje.users.api;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

/**
 * Endpoint de health check para el users-service
 */
@Path("/health")
@Produces(MediaType.APPLICATION_JSON)
public class HealthResource {
    
    @GET
    public HealthResponse health() {
        HealthResponse response = new HealthResponse();
        response.status = "UP";
        response.service = "users-service";
        response.timestamp = System.currentTimeMillis();
        return response;
    }
    
    public static class HealthResponse {
        public String status;
        public String service;
        public long timestamp;
    }
}
