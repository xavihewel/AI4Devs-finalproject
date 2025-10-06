# Progress

## What Works
- Documentación MVP (`doc/MVP`), plan (`doc/plan/*`), infra (`docker-compose`, `doc/setup/*`).
- OpenAPI inicial (`doc/api/*`).
- Auth-service: `JwtValidator` (JWKS) + tests OK.
- Users-service: `/users/me` GET/PUT (DTO directo) + tests.
- Trips-service: `/trips` POST/GET (DTOs directos) + tests.
- Booking-service: `/bookings` POST/GET (DTO directo) + tests.
- Matching-service: `/matches` GET (mock + score simple) + tests.
- Seguridad: `AuthFilter` con validación JWT real (Nimbus) en users/trips/booking/matching; tests unitarios de filtros.
- Propagación `userId` en `trips` (driverId) y `booking` (passengerId, listMine).
- Frontend: SPA React/TS con Vite, Keycloak OIDC (PKCE) y routing básico; cliente Axios adjunta Bearer; páginas `/`, `/trips`, `/matches`, `/bookings`, `/me`.
 - Frontend tests: Vitest + RTL configurados (jsdom, jest-dom). Test de `Home` funcionando con mock de `getKeycloak()`.

## What's Left
- Seeds/migraciones; repos en memoria/PG para alimentar matching y booking.
- Alinear DTOs con OpenAPI y ampliar verificación de contrato.
- Frontend: generar tipos desde OpenAPI, formularios (crear trip y reserva), manejo de errores y layout.
 - Frontend tests: añadir pruebas para rutas protegidas y cliente Axios con token.

## Current Status
MVP backend esqueleto listo con endpoints y tests unitarios; matching básico implementado y filtros mínimos de seguridad activos. Frontend base listo con auth y navegación; pendiente afinar UX y contratos.

## Known Issues
- Sin persistencia ni integración real entre servicios (mock/echo DTOs).
- Falta wiring de `JwtValidator` en filtros para validación real.
 - Frontend aún sin tipos generados ni formularios de creación.
