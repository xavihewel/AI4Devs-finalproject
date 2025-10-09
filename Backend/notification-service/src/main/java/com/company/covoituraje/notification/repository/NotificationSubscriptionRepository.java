package com.company.covoituraje.notification.repository;

import com.company.covoituraje.notification.domain.NotificationSubscription;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.Optional;

public class NotificationSubscriptionRepository {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public NotificationSubscription save(NotificationSubscription subscription) {
        if (subscription.getId() == null) {
            entityManager.persist(subscription);
        } else {
            subscription = entityManager.merge(subscription);
        }
        return subscription;
    }
    
    public Optional<NotificationSubscription> findByUserIdAndEndpoint(String userId, String endpoint) {
        TypedQuery<NotificationSubscription> query = entityManager.createQuery(
            "SELECT ns FROM NotificationSubscription ns WHERE ns.userId = :userId AND ns.endpoint = :endpoint",
            NotificationSubscription.class
        );
        query.setParameter("userId", userId);
        query.setParameter("endpoint", endpoint);
        
        List<NotificationSubscription> results = query.getResultList();
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }
    
    public List<NotificationSubscription> findActiveByUserId(String userId) {
        TypedQuery<NotificationSubscription> query = entityManager.createQuery(
            "SELECT ns FROM NotificationSubscription ns WHERE ns.userId = :userId AND ns.active = true",
            NotificationSubscription.class
        );
        query.setParameter("userId", userId);
        return query.getResultList();
    }
    
    public void delete(NotificationSubscription subscription) {
        if (entityManager.contains(subscription)) {
            entityManager.remove(subscription);
        } else {
            entityManager.remove(entityManager.merge(subscription));
        }
    }
}
