package com.company.covoituraje.users.api;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsersResourceTest {

    @Test
    void getMe_returnsDefaultUser() {
        // Set user context
        UsersResource.AuthContext.setUserId("user-001");
        try {
            UsersResource resource = new UsersResource();
            UserDto body = resource.getMe();
            assertNotNull(body);
            assertEquals("user-001", body.id);
            assertEquals("Ana García", body.name);
        } finally {
            UsersResource.AuthContext.clear();
        }
    }

    @Test
    void putMe_echoesUpdate() {
        // Set user context
        UsersResource.AuthContext.setUserId("user-001");
        try {
            UsersResource resource = new UsersResource();
            UserDto update = new UserDto();
            update.name = "Updated Name";
            update.sedeId = "SEDE-2";
            UserDto body = resource.updateMe(update);
            assertEquals("Updated Name", body.name);
            assertEquals("SEDE-2", body.sedeId);
        } finally {
            UsersResource.AuthContext.clear();
        }
    }
}
