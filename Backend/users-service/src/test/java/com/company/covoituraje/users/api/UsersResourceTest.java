package com.company.covoituraje.users.api;

import com.company.covoituraje.users.domain.User;
import com.company.covoituraje.users.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UsersResourceTest {

    private UsersResource resource;
    private UserRepository repository;

    @BeforeEach
    void setUp() {
        resource = new UsersResource();
        repository = new UserRepository();
        
        // Always create a fresh test user to avoid test interference
        User testUser = new User("user-001", "Ana García", "ana.garcia@company.com", "SEDE-1", "EMPLOYEE");
        repository.save(testUser);
    }

    @Test
    void getMe_returnsDefaultUser() {
        // Set user context
        UsersResource.AuthContext.setUserId("user-001");
        try {
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
            UserDto update = new UserDto();
            update.name = "Updated Name";
            update.sedeId = "SEDE-2";
            update.email = "ana.garcia@company.com";
            
            UserDto body = resource.updateMe(update);
            assertEquals("Updated Name", body.name);
            assertEquals("SEDE-2", body.sedeId);
        } finally {
            UsersResource.AuthContext.clear();
        }
    }
}
