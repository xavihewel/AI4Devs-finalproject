# Tech Context

## Stack
- Languages: Java 17 (backend), TypeScript (frontend).
- Backend: Jakarta EE on Java 17, Maven (v10) build, JUnit 5 + Mockito for tests.
- Frontend: React (SPA/PWA) con TypeScript + Vite; routing con `react-router-dom`, auth con `keycloak-js` (PKCE) y cliente HTTP con `axios`.
- Optional edge/server: Node.js + Express para middleware o herramientas dev.
- Database: PostgreSQL (con PostGIS si se requiere geo), Redis opcional.

## Development Setup
- Backend (Java 17 + Jakarta + Maven): estructura según DDD (módulos dominio, aplicación, infraestructura); pruebas con JUnit5/Mockito via Maven surefire; perfiles de configuración (dev/test).
- **Persistencia**: PostgreSQL en puerto 5434, schemas separados por servicio, Flyway para migraciones.
- **JPA Configuration**: `persistence.xml` por servicio, `JpaConfig` para EntityManager, RESOURCE_LOCAL transactions.
- Frontend (React/TS): autenticación OIDC (Keycloak), PWA opcional; scripts `dev/build/preview`; variables `VITE_*` para issuer/clientId/redirect y base URL API.
 - Frontend (React/TS): autenticación OIDC (Keycloak), PWA opcional; scripts `dev/build/preview`; variables `VITE_*` para issuer/clientId/redirect y base URL API; Web Push con Service Worker (`public/sw.js`) y VAPID.
- Servicios locales: PostgreSQL, Redis; docker-compose recomendado para orquestación.
- Documentación técnica en `/doc` con PlantUML y Mermaid; prompts en `/Prompts/prompts_xvb.md`.

### CORS y Entornos (actualizado)
- Backend expone CORS mediante `CorsFilter` por servicio que refleja el `Origin` permitido.
- Variable de entorno `ALLOWED_ORIGINS` (coma-separado) controla orígenes permitidos; por defecto `http://localhost:5173`.
- `docker-compose.yml` inyecta `ALLOWED_ORIGINS` en `trips/users/booking/matching` para desarrollo local.
 - `docker-compose.yml` inyecta `ALLOWED_ORIGINS` y `NOTIFICATION_SERVICE_URL` en servicios que lo requieren.
- Frontend modo dev (`Vite` en 5173): `scripts/start-frontend-dev.sh` genera `Frontend/.env.local` con:
  - `VITE_USERS_API_BASE_URL=http://localhost:8082/api`
  - `VITE_TRIPS_API_BASE_URL=http://localhost:8081/api`
  - `VITE_BOOKING_API_BASE_URL=http://localhost:8083/api`
  - `VITE_MATCHING_API_BASE_URL=http://localhost:8084/api`
  - `VITE_OIDC_ISSUER` y `VITE_OIDC_CLIENT_ID`

## Constraints
- DDD/TDD/SOLID como guía: pruebas antes de código funcional; límites de contexto claros; separación de capas.
- Privacidad y cumplimiento (RGPD): almacenar zona aproximada; cifrado en tránsito/ reposo.

## Dependencies
- Maven: Jakarta EE API, JAX-RS, **JPA/Hibernate IMPLEMENTADO**, PostgreSQL driver, **Flyway**, JUnit5, Mockito, **Testcontainers**, **Jackson** para serialización.
- **DependencyManagement centralizado** en parent POM para versiones consistentes.
- **ThreadLocal AuthContext**: Para propagación de userId en todos los servicios.
- **Jakarta Bean Validation**: Para validación de entrada en REST APIs.
- **ServiceHttpClient**: Cliente HTTP compartido para comunicación entre microservicios.
- **DTOs compartidos**: Tipos estandarizados para comunicación entre servicios.
- Frontend: React 19, TypeScript, Tailwind CSS, react-router-dom, keycloak-js, axios, Vite, Jest, Testing Library. Web Push API + Service Worker.
- Infra: Docker, docker-compose; PostgreSQL con PostGIS; Keycloak como IdP de dev; scripts de automatización.

## Implementation Status
- **✅ FASE 1**: Persistencia completa (PostgreSQL + JPA + Flyway + Seeds)
- **✅ FASE 2**: APIs REST con JPA (repositorios reales, AuthFilter estandarizado, algoritmo de matching)
- **✅ FASE 3**: Tests de integración (Testcontainers configurado, 23 tests pasando)
- **✅ FASE 4**: Docker-compose para desarrollo local (infraestructura completa, scripts automatización)
- **✅ FASE 5**: Integraciones entre servicios (ServiceHttpClient, DTOs compartidos, validaciones cross-service)
- **✅ FRONTEND BASE**: React + TypeScript + Tailwind CSS (componentes UI, servicios API, páginas principales)

## Local Ports & Health Checks
- Puertos locales: trips `8081`, users `8082`, booking `8083`, matching `8084`, notifications `8085` (todos bajo `@ApplicationPath("/api")`).
- Health: `GET /api/health` exento de autenticación en todos los servicios.
- OIDC dev: `OIDC_ISSUER_URI=http://localhost:8080/realms/covoituraje`; tokens con `aud=backend-api`.
