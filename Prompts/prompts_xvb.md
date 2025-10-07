# Prompts Log (prompts_xvb)

## 2025-10-06
- Intent: Arrancar Memory Bank y alinear documentación.
- Actions: Crear `memory-bank/` con core files; sincronizar con `doc/MVP`.

- Intent: Alinear con `prompts_codigo.md` (Java 17/Jakarta, React/TS, PostgreSQL, DDD/TDD/SOLID).
- Actions: Actualizar `techContext.md`, `systemPatterns.md`, `productContext.md`, `activeContext.md`, `progress.md`.

- Intent: Planificación.
- Actions: Crear `doc/plan/epics.md`, `user-stories.md`, `tickets.md`.

- Intent: Infra local.
- Actions: Añadir `docker-compose.yml`; crear `doc/setup/local.md`, `doc/setup/keycloak.md`, `doc/setup/env.md`.

- Intent: Contratos API (OpenAPI) para TDD.
- Actions: Añadir `doc/api/*` para auth, users, trips, booking, matching; enlazar en plan/progress.

- Intent: Estructura del repo.
- Actions: Crear `Backend/` (microservicios con READMEs) y `Frontend/` (README).

- Intent: A1 Auth (TDD plan).
- Actions: Añadir `doc/plan/tests-auth.md` con escenarios de test para JwtValidator/JWKS.

## 2025-10-07

### FASE 1: Persistencia (PostgreSQL + JPA + Flyway)
- Intent: Implementar persistencia real con PostgreSQL, JPA y Flyway para todos los servicios.
- Actions: 
  - Actualizar parent POM con dependencyManagement para JPA/Hibernate, PostgreSQL, Flyway, Testcontainers
  - Configurar docker-compose.yml con PostgreSQL en puerto 5433
  - Crear migraciones Flyway V1/V2 para todos los servicios (trips, users, bookings, matches)
  - Implementar entidades JPA: Trip, User, Booking, Match con anotaciones completas
  - Crear repositorios JPA reemplazando repositorios in-memory
  - Configurar persistence.xml y JpaConfig para cada servicio
  - Insertar seeds realistas (5 registros por tabla)
- Decisions: Schemas separados por servicio, RESOURCE_LOCAL transactions para simplicidad MVP
- Result: ✅ Completado - Persistencia funcionando en todos los servicios

### FASE 2: APIs REST con JPA
- Intent: Migrar recursos REST de repositorios in-memory a JPA reales.
- Actions:
  - Actualizar todos los recursos REST para usar repositorios JPA
  - Implementar ThreadLocal AuthContext para propagación de userId
  - Estandarizar AuthFilter con patrón ThreadLocal en todos los servicios
  - Implementar algoritmo de matching real con scoring 0.0-1.0
  - Agregar validaciones REST usando Jakarta Bean Validation
  - Actualizar DTOs (BookingDto con seatsRequested, MatchDto con campos detallados)
  - Crear MatchingService con lógica de scoring basada en destino, tiempo, origen y asientos
- Decisions: 
  - ThreadLocal AuthContext para manejo consistente de contexto de usuario
  - Business methods en entidades JPA para lógica de negocio
  - Scoring algorítmico para matching en lugar de mocks
- Result: ✅ Completado - APIs REST funcionando con JPA real

### FASE 3: Tests de integración con Testcontainers
- Intent: Implementar tests de integración usando Testcontainers con PostgreSQL real.
- Actions:
  - Configurar Testcontainers con PostgreSQL + PostGIS para tests de integración
  - Crear tests de integración para todos los servicios:
    - trips-service: 4 tests (save/find, findByDestination, findAvailable, updateSeats)
    - users-service: 5 tests (save/find, findBySede, findByRole, update, findById)
    - booking-service: 6 tests (save/find, findByPassenger, findByTrip, findByStatus, updateStatus, findById)
    - matching-service: 8 tests (save/find, findByTrip, findByPassenger, findByDriver, findByStatus, findHighScore, findByTripAndPassenger, updateStatus)
  - Configurar schemas separados para cada servicio en tests
  - Implementar configuración dinámica de EntityManager para tests
  - Crear scripts init-schema.sql para inicialización de tests
- Decisions:
  - Testcontainers para tests con base de datos real
  - Schemas separados para aislar tests por servicio
  - Configuración dinámica para flexibilidad en tests
- Result: ✅ Completado - 23 tests de integración pasando

### Problemas resueltos durante implementación:
- Error: Orden incorrecto de parámetros en constructor Match (tripId, driverId, passengerId vs tripId, passengerId, driverId)
- Error: Configuración JPA en tests con hibernate.hbm2ddl.auto=create-drop causando pérdida de seed data
- Error: Testcontainers no reconociendo postgis/postgis como compatible con postgres
- Error: Método findAvailableTrips requería parámetro destinationSedeId
- Error: AuthContext no configurado en tests unitarios de users-service

### Patrones técnicos establecidos:
- ThreadLocal AuthContext para propagación de userId
- Business methods en entidades JPA para encapsular lógica de negocio
- Testcontainers para tests de integración con bases de datos reales
- Schemas separados por servicio para aislamiento
- RESOURCE_LOCAL transactions para simplicidad del MVP
- Jakarta Bean Validation para validación de entrada en REST APIs
