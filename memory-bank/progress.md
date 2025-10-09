# Progress

## What Works
- **Infra local**: `docker-compose` con DB, Keycloak, Mailhog y microservicios (trips 8081, users 8082, booking 8083, matching 8084).
- **Base REST**: `@ApplicationPath("/api")` activo en todos los servicios.
- **Health**: `GET /api/health` operativo en `trips`, `users`, `booking`, `matching`; `AuthFilter` ignora `/api/health` en todos.
- **Auth/OIDC Backend**: Token con `aud=backend-api` (mapper en Keycloak); `OIDC_ISSUER_URI` alineado a localhost.
- **Frontend Base**: React + TypeScript + Tailwind; dual mode (Docker + local dev). UI functional, navegación funciona.
- **Scripts de automatización**: 10 scripts operativos para setup, verificación, arranque y testing.
  - Setup: `setup-dev.sh`, `dev-infra.sh`, `setup-keycloak.sh`, `migrate.sh`
  - Verificación: `verify-infra.sh`, `verify-all.sh`
  - Frontend: `start-frontend.sh`, `start-frontend-dev.sh`, `start-all-services.sh`
  - Testing: `run-e2e-tests.sh`
- **Cypress E2E**: Suite de ~21 tests E2E implementada y organizada. Smoke tests (6/6 ✅) funcionando perfectamente.
- **Documentación**: `QUICK-START.md`, `doc/setup/frontend-setup.md`, `doc/setup/verificacion-sistema.md`, `Frontend/cypress/README.md` completos.
 - **CORS**: Política CORS corregida; `ALLOWED_ORIGINS` soportado y configurado en Docker para front local (`http://localhost:5173`).
- **Tests backend (unidad/integración)**: Suite verde en `shared`, `auth-service`, `users-service`, `trips-service`, `booking-service`, `matching-service`.
  - Recursos con DI habilitada (`UsersResource`, `TripsResource`, `BookingResource`, `MatchesResource`).
  - `users` y `trips` usan Testcontainers para repos/recursos.
  - `booking` usa Testcontainers + mocks de integraciones.
  - `matching` usa DI y repositorio mockeado (sin DB) en unit tests, y test de integración con filtro por fecha.
  - Añadido `AuthUtilsTest` en `shared`.

## What's Left
- **Revalidar Login**: Tras fix CORS, re-ejecutar tests de autenticación y confirmar que `/users/me` funciona desde FE local.
- **Feature Plan**: Seguir `memory-bank/featurePlan.md` para priorizar Fase MVP → Fase 2 → Fase 3.
- **Testing E2E completo**: Una vez arreglado login, completar suite de tests Cypress (authentication, trips, matches, bookings, flows).
- **Auth JWKS remoto (tests)**: Añadir tests con WireMock para `JwtValidator` con JWKS HTTP (éxito, timeout, key miss, caché).
- **Frontend features**: Completar todas las páginas (Bookings más robusta, Profile funcional, Admin).
- **Observabilidad avanzada**: Métricas, tracing distribuido, agregación de logs.
- **API Gateway**: Implementar gateway con routing path-based para unificar acceso.
- **CI/CD**: Pipeline de integración y despliegue continuo con Cypress.
 - **Producción: Autenticación habilitada**: Confirmar que `AUTH_DISABLED=false` y que la validación JWT esté activa en todos los servicios para despliegues a producción (y roles según `REQUIRE_ROLE_EMPLOYEE`).

## Current Status
- ✅ Sistema completamente funcional y arrancable con un solo comando (`start-all-services.sh`)
- ✅ Infraestructura automatizada con verificación en capas
- ✅ Keycloak funcionando correctamente (verificado por scripts; revisar si no arranca en algunos entornos)
- ✅ Cypress E2E instalado y configurado - smoke tests (6/6 ✅) pasando
- 🔄 Frontend login: revalidación tras corrección de CORS y ajuste de `.env.local`
- ✅ Backend unit/integration tests en verde con DI/Testcontainers.

## Known Issues
- ⚠️ Posibles diferencias entre modo Docker y modo Vite local para variables de entorno
- ⚠️ Frontend en Docker requiere rebuild manual para ver cambios (usar modo dev local para desarrollo)
- ⚠️ Microservicios tardan ~30s en arrancar completamente (normal para Payara Micro)
- ⚠️ Tests E2E de authentication (4/8) fallan por problema de login - esperan timeouts largos
