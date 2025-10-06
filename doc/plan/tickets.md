# Technical Tickets (MVP, por microservicio)

## auth-service (Java 17 + Jakarta)
- Ticket A1: Configurar OIDC con Keycloak (JAX-RS filter + JWKS) [tests JUnit5]
- Ticket A2: Endpoint callback/login y validación de roles [tests]

## users-service
- Ticket U1: Modelo `User` + JPA + repositorio; migración Flyway [tests]
- Ticket U2: Recursos JAX-RS `/users` GET/PUT (perfil mínimo) [tests]

## trips-service
- Ticket T1: Modelo `Trip` con campos mínimos + PostGIS; migración [tests]
- Ticket T2: Recursos `/trips` POST/GET con filtros básicos (sede/horario) [tests]

## booking-service
- Ticket B1: Modelo `Booking` + estados; migración [tests]
- Ticket B2: Recursos `/bookings` POST/GET; reserva inmediata [tests]

## matching-service
- Ticket M1: Endpoint `/matches` con score simple (sede + franja) [tests]
- Ticket M2: Integración con `trips-service` y `users-service` [tests]

## infra (repo raíz)
- Ticket I1: docker-compose (PostgreSQL+PostGIS, Redis, Keycloak, Mailhog opcional)
- Ticket I2: Scripts de migración/seeds y README de setup local
