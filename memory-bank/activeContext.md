# Active Context

## Current Focus
- **Testing E2E con Cypress**: Suite de tests E2E implementada. Smoke tests funcionando, tests de autenticación revelando bug crítico en login.
- **Frontend OIDC Bug**: Botones de login no funcionan - variables VITE_* no se reemplazan correctamente en build. Investigando solución.
- **DevOps & Scripts**: Sistema completo de scripts de automatización implementado (10 scripts totales incluyendo run-e2e-tests.sh).
- **Backend**: Migrado a WAR + Payara Micro (JDK17) en `trips`, `users`, `booking`, `matching`; todos con `@ApplicationPath("/api")` y `HealthResource`.
- **Infra local**: `docker-compose.yml` con PostgreSQL (5434), Keycloak (8080), Mailhog (8025), microservicios operativos.

## Recent Changes
- **Cypress E2E Setup**: Cypress 15.4.0 instalado con ~21 tests E2E organizados en suites (smoke, authentication, navigation, flows).
- **Custom Commands**: `cy.loginViaKeycloak()`, `cy.logout()`, `cy.getByCy()` con cy.session() para performance.
- **Tests Results**: Smoke tests (6/6 ✅), Authentication tests (4/8 ❌ por bug de login).
- **Frontend env.ts**: Corregido para usar `import.meta.env.VITE_*` directamente en lugar de eval trick.
- **Frontend Dockerfile**: Añadidos ARG/ENV para variables VITE_* en build time.
- **docker-compose.yml**: Variables OIDC movidas a `build.args` y añadida `VITE_OIDC_REDIRECT_URI`.
- **Scripts actualizados**: NPM scripts para Cypress (test:e2e, test:e2e:smoke, etc.) usando Electron browser.
- **Documentación Cypress**: README completo en `Frontend/cypress/README.md` con guías y best practices.

## Next Steps (immediate)
- **FIX CRÍTICO**: Resolver por qué variables VITE_* no se están inyectando correctamente en el bundle del frontend.
- **Debugging**: Verificar bundle compilado para confirmar si variables están o no reemplazadas.
- **Rebuild frontend**: Con configuración correcta de variables de entorno.
- **Re-run tests**: Después del fix, ejecutar suite completa de Cypress para validar.

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
 - **Autenticación en producción**: El bypass de auth (`AUTH_DISABLED=true`) es solo para desarrollo/test. En producción debe estar desactivado (`AUTH_DISABLED=false`) y la validación JWT debe permanecer activa (incluyendo `REQUIRE_ROLE_EMPLOYEE` según políticas).
