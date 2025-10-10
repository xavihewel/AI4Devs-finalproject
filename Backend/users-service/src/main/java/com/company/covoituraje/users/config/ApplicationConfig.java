package com.company.covoituraje.users.config;

import com.company.covoituraje.users.api.RatingResource;
import com.company.covoituraje.users.filter.CorsFilter;
import com.company.covoituraje.users.infrastructure.RatingRepository;
import com.company.covoituraje.users.service.RatingService;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/api")
public class ApplicationConfig extends Application {
    
    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> classes = new HashSet<>();
        classes.add(RatingResource.class);
        classes.add(CorsFilter.class);
        return classes;
    }
    
    @Override
    public Set<Object> getSingletons() {
        Set<Object> singletons = new HashSet<>();
        
        // Create and register RatingResource with dependencies
        RatingRepository ratingRepository = new RatingRepository();
        RatingService ratingService = new RatingService(ratingRepository);
        RatingResource ratingResource = new RatingResource(ratingService);
        
        singletons.add(ratingResource);
        return singletons;
    }
}
