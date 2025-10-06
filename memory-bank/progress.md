# Progress

## What Works
- Documentación MVP (`doc/MVP`), plan (`doc/plan/*`), infra (`docker-compose`, `doc/setup/*`).
- OpenAPI inicial (`doc/api/*`).
- Auth-service: `JwtValidator` (JWKS) + tests OK.
- Users-service: `/users/me` GET/PUT (DTO directo) + tests.
- Trips-service: `/trips` POST/GET (DTOs directos) + tests.
- Booking-service: `/bookings` POST/GET (DTO directo) + tests.

## What's Left
- Matching-service: `/matches` GET (score básico) + tests.
- Añadir validación JWT en recursos (filtro) y wiring mínimo.
- Seeds/migraciones y conexión a PG/Redis en local.

## Current Status
MVP backend esqueleto en marcha con endpoints y tests unitarios básicos; pendiente matching y seguridad a nivel de endpoints.

## Known Issues
- Falta integración real entre servicios (por ahora stubs/echo DTOs).
- Alinear DTOs con OpenAPI si evolucionan.
