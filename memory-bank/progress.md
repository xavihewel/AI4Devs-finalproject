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

## What's Left
- **FIX CRÍTICO Frontend Login**: Variables VITE_* no se inyectan correctamente en bundle - botones login/comenzar no funcionan.
- **Testing E2E completo**: Una vez arreglado login, completar suite de tests Cypress (authentication, trips, matches, bookings, flows).
- **Frontend features**: Completar todas las páginas (Bookings más robusta, Profile funcional, Admin).
- **Observabilidad avanzada**: Métricas, tracing distribuido, agregación de logs.
- **API Gateway**: Implementar gateway con routing path-based para unificar acceso.
- **CI/CD**: Pipeline de integración y despliegue continuo con Cypress.

## Current Status
- ✅ Sistema completamente funcional y arrancable con un solo comando (`start-all-services.sh`)
- ✅ Infraestructura automatizada con verificación en capas
- ✅ Keycloak funcionando correctamente
- ✅ Cypress E2E instalado y configurado - smoke tests (6/6 ✅) pasando
- ❌ Frontend login bloqueado - variables OIDC no compiladas correctamente en Docker build
- 🔄 Investigando solución para inyección de variables en build time de Vite

## Known Issues
- ❌ **CRÍTICO**: Botones "Iniciar Sesión" y "Comenzar Ahora" no funcionan - variables VITE_* no se reemplazan en build de Docker
- ⚠️ Frontend en Docker requiere rebuild manual para ver cambios (usar modo dev local para desarrollo)
- ⚠️ Microservicios tardan ~30s en arrancar completamente (normal para Payara Micro)
- ⚠️ Tests E2E de authentication (4/8) fallan por problema de login - esperan timeouts largos
