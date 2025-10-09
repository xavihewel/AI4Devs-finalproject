package com.company.covoituraje.notification.service;

import com.company.covoituraje.notification.config.VapidConfig;
import com.company.covoituraje.notification.domain.NotificationSubscription;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.Json;
import jakarta.json.JsonObject;
import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Subscription;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;

import java.nio.charset.StandardCharsets;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@ApplicationScoped
public class PushNotificationService {
    
    @Inject
    private VapidConfig vapidConfig;
    
    private PushService pushService;
    
    public void sendNotification(NotificationSubscription subscription, String title, String body) {
        try {
            if (pushService == null) {
                initializePushService();
            }
            
            String payload = createPayload(title, body);
            // Simplified implementation for now
            System.out.println("Sending push notification to: " + subscription.getEndpoint());
            System.out.println("Title: " + title + ", Body: " + body);
            
        } catch (Exception e) {
            System.err.println("Error sending push notification: " + e.getMessage());
            // Don't throw exception to avoid breaking the main flow
        }
    }
    
    public String createPayload(String title, String body) {
        JsonObject payload = Json.createObjectBuilder()
            .add("title", title)
            .add("body", body)
            .add("icon", "/icon-192x192.png")
            .add("badge", "/badge-72x72.png")
            .add("data", Json.createObjectBuilder()
                .add("url", "/")
                .build())
            .build();
        
        return payload.toString();
    }
    
    private void initializePushService() throws Exception {
        pushService = new PushService();
        pushService.setSubject(vapidConfig.getSubject());
        pushService.setPublicKey(vapidConfig.getPublicKey());
        pushService.setPrivateKey(vapidConfig.getPrivateKey());
    }
    
    // Simplified implementation - removed complex web push subscription creation
}
