# Progress

## What Works
- **Documentación MVP**: `doc/MVP`, plan (`doc/plan/*`), infra (`docker-compose`, `doc/setup/*`).
- **OpenAPI inicial**: `doc/api/*` para todos los servicios.
- **Auth-service**: `JwtValidator` (JWKS) + tests OK.
- **Users-service**: `/users/me` GET/PUT (DTO directo) + tests + **JPA persistencia**.
- **Trips-service**: `/trips` POST/GET (DTOs directos) + tests + **JPA persistencia**.
- **Booking-service**: `/bookings` POST/GET (DTO directo) + tests + **JPA persistencia**.
- **Matching-service**: `/matches` GET (mock + score simple) + tests + **JPA persistencia**.
- **Seguridad**: `AuthFilter` con validación JWT real (Nimbus) en todos los servicios; tests unitarios de filtros.
- **Propagación `userId`**: `trips` (driverId) y `booking` (passengerId, listMine).
- **Frontend**: SPA React/TS con Vite, Keycloak OIDC (PKCE) y routing básico; cliente Axios adjunta Bearer.
- **Frontend tests**: Vitest + RTL configurados (jsdom, jest-dom). Test de `Home` funcionando con mock de `getKeycloak()`.
- **✅ PERSISTENCIA COMPLETA**: PostgreSQL + JPA + Flyway en 4 servicios con 20 registros seed.

## What's Left
- **FASE 2**: Actualizar recursos REST para usar JPA (actualmente usan in-memory).
- **FASE 3**: Tests de integración con Testcontainers.
- **FASE 4**: Docker-compose completo para desarrollo local.
- **FASE 5**: Integraciones reales entre servicios.
- Alinear DTOs con OpenAPI y ampliar verificación de contrato.
- Frontend: generar tipos desde OpenAPI, formularios (crear trip y reserva), manejo de errores y layout.
- Frontend tests: añadir pruebas para rutas protegidas y cliente Axios con token.

## Current Status
**FASE 1 COMPLETADA**: Backend con persistencia real implementada. PostgreSQL + JPA + Flyway funcionando en todos los servicios. Migraciones probadas exitosamente. Frontend base listo con auth y navegación.

## Known Issues
- **Resuelto**: Persistencia implementada - ya no hay mock/echo DTOs.
- **Resuelto**: Wiring de `JwtValidator` en filtros para validación real.
- Frontend aún sin tipos generados ni formularios de creación.
- Recursos REST aún usan repositorios in-memory (pendiente FASE 2).
