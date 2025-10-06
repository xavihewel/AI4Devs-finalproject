# Active Context

## Current Focus
- Validación JWT real integrada en filtros y propagación de `userId`; tests de filtros.
- Frontend: scaffolding SPA (React/TS con Vite), auth OIDC (Keycloak), routing, y cliente API con Bearer.

## Recent Changes
- Auth: `JwtValidator` (Nimbus) + tests OK.
- Users: `/users/me` GET/PUT (DTO directo) + tests.
- Trips: `/trips` POST/GET (DTOs directos) + tests.
- Booking: `/bookings` POST/GET (DTO directo) + tests.
- Matching: `/matches` GET con mock + score simple + tests.
- Seguridad: `AuthFilter` con validación JWT real en users/trips/booking/matching; ctor inyectable; tests de `AuthFilter` en los cuatro servicios.
- Propagación de `userId`: `trips` asigna `driverId`; `booking` usa `userId` para `passengerId` y filtrar `listMine`.
- Frontend creado en `Frontend/` con Vite + React/TS: Keycloak-js (PKCE), rutas (`/`, `/trips`, `/matches`, `/bookings`, `/me`), axios con token Bearer.

## Next Steps
- Completar persistencia/Seeds y repos PG.
- Alinear DTOs con OpenAPI y verificación de contrato.
- Integraciones entre servicios (matching usando trips seedados).
- Frontend: preparar `.env`, validar login/logout y llamadas a API; generar tipos desde OpenAPI, añadir formularios (crear trip/reserva), estados de carga/errores y layout.

## Decisions & Considerations
- Tests de recursos devolviendo DTOs directamente para evitar `RuntimeDelegate`.
- Mantener OpenAPI como contrato guía; verificar campos clave en tests.
- Frontend usa Vite, react-router-dom, keycloak-js y axios; las variables se leen como `VITE_*` y el cliente adjunta automáticamente `Authorization: Bearer` a las llamadas.
