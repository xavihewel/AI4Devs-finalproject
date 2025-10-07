# Progress

## What Works
- **Infra local**: `docker-compose` con DB, Keycloak, Mailhog y microservicios (trips 8081, users 8082, booking 8083, matching 8084).
- **Base REST**: `@ApplicationPath("/api")` activo en todos los servicios.
- **Health**: `GET /api/health` operativo en `trips`, `users`, `booking`, `matching`; `AuthFilter` ignora `/api/health` en todos.
- **Auth/OIDC**: Token con `aud=backend-api` (mapper en Keycloak); `OIDC_ISSUER_URI` alineado a localhost.
- **Frontend**: Test de salud integra OK; harness de integración funcionando.

## What's Left
- **Estabilizar flujos**: `/api/trips` debe responder 200 estable; investigar 401/timeout residuales.
- **Consistencia JPA**: Confirmar `hbm2ddl=update` donde aplique o ejecutar Flyway V1/V2 en runtime.
- **Versionamiento**: Consolidar cambios en `pom.xml`/`persistence.xml`/Dockerfiles y confirmar.
- **Frontend**: Re-ejecutar tests de flujos (Trips/Matches) una vez estabilizado backend.

## Current Status
- Proyecto arrancado con infra y microservicios accesibles; `/api/health` OK en 8081–8084. Autenticación operativa; pendiente estabilizar `/api/trips` para flujos e2e.

## Known Issues
- Respuestas 401/timeout intermitentes en `/api/trips` bajo carga/reinicio.
- Validar que el `audience` llegue al backend (tokens recientes ya lo incluyen).
