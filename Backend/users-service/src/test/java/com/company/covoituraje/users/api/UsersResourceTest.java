package com.company.covoituraje.users.api;

import com.company.covoituraje.users.domain.User;
import com.company.covoituraje.users.infrastructure.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
class UsersResourceTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("postgis/postgis:15-3.4").asCompatibleSubstituteFor("postgres"))
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test")
            .withInitScript("init-schema.sql");

    private EntityManagerFactory emf;
    private EntityManager em;

    private UsersResource resource;
    private UserRepository repository;

    @BeforeEach
    void setUp() {
        createSchema();

        var props = new java.util.Properties();
        props.setProperty("jakarta.persistence.jdbc.driver", "org.postgresql.Driver");
        props.setProperty("jakarta.persistence.jdbc.url", postgres.getJdbcUrl());
        props.setProperty("jakarta.persistence.jdbc.user", postgres.getUsername());
        props.setProperty("jakarta.persistence.jdbc.password", postgres.getPassword());
        props.setProperty("hibernate.hbm2ddl.auto", "create");
        props.setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");

        emf = Persistence.createEntityManagerFactory("users-pu", props);
        em = emf.createEntityManager();
        repository = new UserRepository(em);
        resource = new UsersResource(repository);
        
        // Always create a fresh test user to avoid test interference
        User testUser = new User("user-001", "Ana García", "ana.garcia@company.com", "SEDE-1", "EMPLOYEE");
        repository.save(testUser);
    }

    private void createSchema() {
        try (var connection = postgres.createConnection("")) {
            try (var statement = connection.createStatement()) {
                statement.execute("CREATE SCHEMA IF NOT EXISTS users;");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to create schema", e);
        }
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
