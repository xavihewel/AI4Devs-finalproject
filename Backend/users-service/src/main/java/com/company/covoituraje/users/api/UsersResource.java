package com.company.covoituraje.users.api;

import com.company.covoituraje.users.domain.User;
import com.company.covoituraje.users.infrastructure.UserRepository;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.ArrayList;
import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UsersResource {

    private final UserRepository repository;

    public UsersResource() {
        this.repository = new UserRepository();
    }

    public UsersResource(UserRepository repository) {
        this.repository = repository;
    }
    
    static final class AuthContext {
        private static final ThreadLocal<String> USER_ID = new ThreadLocal<>();
        static void setUserId(String userId) { USER_ID.set(userId); }
        static String getUserId() { return USER_ID.get(); }
        static void clear() { USER_ID.remove(); }
    }

    @GET
    @Path("/me")
    public UserDto getMe() {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        User user = repository.findById(currentUser)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        return mapToDto(user);
    }

    @PUT
    @Path("/me")
    public UserDto updateMe(UserDto update) {
        String currentUser = AuthContext.getUserId();
        if (currentUser == null || currentUser.isBlank()) {
            throw new BadRequestException("User ID is required");
        }

        User user = repository.findById(currentUser)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        user.updateProfile(update.name, update.email, update.sedeId);
        user = repository.save(user);
        
        return mapToDto(user);
    }

    @GET
    public List<UserDto> list(@QueryParam("sedeId") String sedeId,
                             @QueryParam("role") String role) {
        
        List<User> users;
        if (sedeId != null) {
            users = repository.findBySedeId(sedeId);
        } else if (role != null) {
            users = repository.findByRole(role);
        } else {
            users = repository.findAll();
        }
        
        return users.stream()
                .map(this::mapToDto)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }

    @GET
    @Path("/{id}")
    public UserDto getById(@PathParam("id") String id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.id = user.getId();
        dto.name = user.getName();
        dto.email = user.getEmail();
        dto.sedeId = user.getSedeId();
        dto.roles = List.of(user.getRole());
        return dto;
    }
}
