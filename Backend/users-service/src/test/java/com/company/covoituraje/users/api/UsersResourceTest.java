package com.company.covoituraje.users.api;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsersResourceTest {

    @Test
    void getMe_returnsDefaultUser() {
        UsersResource resource = new UsersResource();
        UserDto body = resource.getMe();
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
        UserDto body = resource.updateMe(update);
        assertEquals("new@example.com", body.email);
        assertEquals("08025", body.zone);
    }
}
