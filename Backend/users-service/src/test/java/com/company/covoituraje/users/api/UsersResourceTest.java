package com.company.covoituraje.users.api;

import jakarta.ws.rs.core.Response;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsersResourceTest {

    @Test
    void getMe_returnsDefaultUser() {
        UsersResource resource = new UsersResource();
        Response response = resource.getMe();
        assertEquals(200, response.getStatus());
        UserDto body = (UserDto) response.getEntity();
        assertNotNull(body);
        assertEquals("me@example.com", body.email);
        assertTrue(body.roles.contains("EMPLOYEE"));
    }

    @Test
    void putMe_echoesUpdate() {
        UsersResource resource = new UsersResource();
        UserDto update = new UserDto();
        update.email = "new@example.com";
        update.zone = "08025";
        Response response = resource.updateMe(update);
        assertEquals(200, response.getStatus());
        UserDto body = (UserDto) response.getEntity();
        assertEquals("new@example.com", body.email);
        assertEquals("08025", body.zone);
    }
}
