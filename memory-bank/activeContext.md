# Active Context

## Current Focus
- **CORS y Dev DX**: Error CORS en `Mi Perfil` solucionado. Política CORS actualizada en todos los microservicios para reflejar el `Origin` con `Vary: Origin` y credenciales.
- **Frontend Env**: `scripts/start-frontend-dev.sh` ahora genera `.env.local` con `VITE_*_API_BASE_URL` correctas (cada servicio con `/api`).
- **Infra local**: `docker-compose.yml` actualizado para inyectar `ALLOWED_ORIGINS=http://localhost:5173` en `trips/users/booking/matching`.
- **Testing E2E con Cypress**: Suite de tests operativa; priorizar re-ejecución tras fix CORS.

## Feature Plan
- Ver `memory-bank/featurePlan.md` para el mapeo de las 15 funcionalidades (cobertura/estado/próximos pasos) y el roadmap por fases.

## Recent Changes
- **CORS (Backend)**: `CorsFilter` actualizado en `users/trips/booking/matching` para devolver `Access-Control-Allow-Origin` igual al `Origin` y añadir `Vary: Origin`. Soporte de `ALLOWED_ORIGINS` vía env.
- **Env (Infra/Frontend)**: Añadido `ALLOWED_ORIGINS` en `env.example` y en `docker-compose.yml` para los servicios backend. `start-frontend-dev.sh` ahora escribe `VITE_USERS_API_BASE_URL`, `VITE_TRIPS_API_BASE_URL`, `VITE_BOOKING_API_BASE_URL`, `VITE_MATCHING_API_BASE_URL` con `/api`.
- **Cypress**: Mantener priorizado re-run de tests de autenticación tras este fix.
- **Backend Tests**: Refactor de tests y recursos para DI + Testcontainers/mocks.
  - `Users/Trips/Booking/Matching` ahora con DI; tests de recursos ya no dependen de DB local.
  - `AuthUtilsTest` añadido; cobertura de filtros Auth extendida (OPTIONS, /health, roles).
  - Filtros por rango datetime:
    - `TripsResource`: soporta `from/to` ISO-8601 (JPA) y HH:mm (memoria). Tests de rango.
    - `BookingResource`: `GET /bookings/mine?from&to` por `createdAt`. Test agregado.
    - `MatchesResource`: `GET /matches/my-matches?from&to` y `GET /matches/driver/{id}?from&to` por `createdAt`. Test integración con Testcontainers.

## Next Steps (immediate)
- **Recrear contenedores**: Aplicar cambios de `ALLOWED_ORIGINS` en Docker y verificar `GET /api/users/me` desde `http://localhost:5173`.
- **Re-run Cypress**: Ejecutar suite de autenticación para validar fin del error CORS.
- **Keycloak health**: Si no arranca, validar puerto 8080 y logs.
- **Auth tests JWKS (WireMock)**: Añadir tests de `JwtValidator` contra JWKS HTTP (timeout, key miss, caché) en `auth-service`.
  - Nota: test de éxito con JWKS remoto deshabilitado temporalmente hasta estabilizar.

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
 - **Autenticación en producción**: El bypass de auth (`AUTH_DISABLED=true`) es solo para desarrollo/test. En producción debe estar desactivado (`AUTH_DISABLED=false`) y la validación JWT debe permanecer activa (incluyendo `REQUIRE_ROLE_EMPLOYEE` según políticas).
