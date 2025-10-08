# Active Context

## Current Focus
- **DevOps & Scripts**: Sistema completo de scripts de automatización implementado. Infraestructura, verificación y arranque de servicios completamente automatizados.
- **Backend**: Migrado a WAR + Payara Micro (JDK17) en `trips`, `users`, `booking`, `matching`; todos con `@ApplicationPath("/api")` y `HealthResource`. `persistence.xml` en `RESOURCE_LOCAL`; `hbm2ddl=update` en `trips/booking/matching`.
- **Infra local**: `docker-compose.yml` con PostgreSQL (5434), Keycloak (8080), Mailhog (8025), microservicios: trips 8081, users 8082, booking 8083, matching 8084. `OIDC_ISSUER_URI` alineado a `http://localhost:8080/realms/covoituraje`.
- **Auth**: Filtro permite `/api/health` sin token en todos. JWT validado contra JWKS de Keycloak; `aud` incluye `backend-api` mediante mapper.
- **Frontend**: Dual mode disponible - Docker (producción-like) y local dev (Vite hot reload). Scripts de arranque automatizados para ambos modos.

## Recent Changes
- **Scripts de verificación**: Creados `verify-infra.sh` (infraestructura) y `verify-all.sh` (sistema completo con microservicios y frontend).
- **Scripts de frontend**: Creados `start-frontend.sh` (Docker), `start-frontend-dev.sh` (local con hot reload), `start-all-services.sh` (sistema completo).
- **Fix Keycloak**: Corregido endpoint de verificación de `/health/ready` (no existe) a `/realms/master` en `dev-infra.sh` y `setup-keycloak.sh`.
- **Documentación**: Actualizado `QUICK-START.md` con comparativas de scripts; creado `doc/setup/frontend-setup.md` y `doc/setup/verificacion-sistema.md`.
- **Developer Experience**: Flujos de trabajo optimizados para desarrollo diario vs demos vs primera vez.

## Next Steps (immediate)
- **Testing end-to-end**: Validar flujos completos con todos los servicios levantados usando `start-all-services.sh`.
- **Frontend development**: Usar `start-frontend-dev.sh` para desarrollo con hot reload.
- **Monitoring**: Considerar agregar health checks más sofisticados y dashboard de estado.

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
