package com.company.covoituraje.notification.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@ApplicationScoped
public class EmailNotificationService {
    
    private String smtpHost = System.getenv().getOrDefault("SMTP_HOST", "localhost");
    private int smtpPort = Integer.parseInt(System.getenv().getOrDefault("SMTP_PORT", "1025"));
    private String smtpUser = System.getenv().getOrDefault("SMTP_USER", "");
    private String smtpPassword = System.getenv().getOrDefault("SMTP_PASSWORD", "");
    private String fromEmail = System.getenv().getOrDefault("FROM_EMAIL", "noreply@covoituraje.com");
    
    private Session mailSession;
    
    public void sendEmail(String to, String subject, String body) {
        try {
            if (mailSession == null) {
                initializeMailSession();
            }
            
            MimeMessage message = new MimeMessage(mailSession);
            message.setFrom(new InternetAddress(fromEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
            message.setSubject(subject);
            message.setText(body, "UTF-8", "html");
            
            Transport.send(message);
            
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            // Don't throw exception to avoid breaking the main flow
        }
    }
    
    public void sendBookingConfirmation(String email, String tripId, int seatsRequested) {
        String subject = "Reserva confirmada - Viaje " + tripId;
        String body = String.format(
            "<h2>¡Reserva confirmada!</h2>" +
            "<p>Tu reserva ha sido confirmada exitosamente.</p>" +
            "<p><strong>Viaje:</strong> %s</p>" +
            "<p><strong>Asientos:</strong> %d</p>" +
            "<p>Gracias por usar Covoituraje Corporativo.</p>",
            tripId, seatsRequested
        );
        
        sendEmail(email, subject, body);
    }
    
    public void sendTripCancellation(String email, String tripId) {
        String subject = "Viaje cancelado - " + tripId;
        String body = String.format(
            "<h2>Viaje cancelado</h2>" +
            "<p>El viaje %s ha sido cancelado.</p>" +
            "<p>Si tienes alguna reserva en este viaje, por favor contacta con el conductor.</p>" +
            "<p>Gracias por usar Covoituraje Corporativo.</p>",
            tripId
        );
        
        sendEmail(email, subject, body);
    }
    
    private void initializeMailSession() {
        java.util.Properties props = new java.util.Properties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.auth", !smtpUser.isEmpty());
        props.put("mail.smtp.starttls.enable", "true");
        
        if (!smtpUser.isEmpty()) {
            mailSession = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(smtpUser, smtpPassword);
                }
            });
        } else {
            mailSession = Session.getInstance(props);
        }
    }
}
