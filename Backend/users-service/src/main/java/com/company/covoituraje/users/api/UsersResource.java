package com.company.covoituraje.users.api;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsersResource {

    @GET
    @Path("/me")
    public UserDto getMe() {
        UserDto me = new UserDto();
        me.id = "00000000-0000-0000-0000-000000000000";
        me.email = "me@example.com";
        me.zone = null;
        me.sedeId = null;
        me.roles = java.util.List.of("EMPLOYEE");
        return me;
    }

    @PUT
    @Path("/me")
    public UserDto updateMe(UserDto update) {
        return update;
    }
}
