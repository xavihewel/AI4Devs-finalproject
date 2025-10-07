# Tech Context

## Stack
- Languages: Java 17 (backend), TypeScript (frontend).
- Backend: Jakarta EE on Java 17, Maven (v10) build, JUnit 5 + Mockito for tests.
- Frontend: React (SPA/PWA) con TypeScript + Vite; routing con `react-router-dom`, auth con `keycloak-js` (PKCE) y cliente HTTP con `axios`.
- Optional edge/server: Node.js + Express para middleware o herramientas dev.
- Database: PostgreSQL (con PostGIS si se requiere geo), Redis opcional.

## Development Setup
- Backend (Java 17 + Jakarta + Maven): estructura según DDD (módulos dominio, aplicación, infraestructura); pruebas con JUnit5/Mockito via Maven surefire; perfiles de configuración (dev/test).
- **Persistencia**: PostgreSQL en puerto 5433, schemas separados por servicio, Flyway para migraciones.
- **JPA Configuration**: `persistence.xml` por servicio, `JpaConfig` para EntityManager, RESOURCE_LOCAL transactions.
- Frontend (React/TS): autenticación OIDC (Keycloak), PWA opcional; scripts `dev/build/preview`; variables `VITE_*` para issuer/clientId/redirect y base URL API.
- Servicios locales: PostgreSQL, Redis; docker-compose recomendado para orquestación.
- Documentación técnica en `/doc` con PlantUML y Mermaid; prompts en `/Prompts/prompts_xvb.md`.

## Constraints
- DDD/TDD/SOLID como guía: pruebas antes de código funcional; límites de contexto claros; separación de capas.
- Privacidad y cumplimiento (RGPD): almacenar zona aproximada; cifrado en tránsito/ reposo.

## Dependencies
- Maven: Jakarta EE API, JAX-RS, **JPA/Hibernate IMPLEMENTADO**, PostgreSQL driver, **Flyway**, JUnit5, Mockito, **Testcontainers**.
- **DependencyManagement centralizado** en parent POM para versiones consistentes.
- **ThreadLocal AuthContext**: Para propagación de userId en todos los servicios.
- **Jakarta Bean Validation**: Para validación de entrada en REST APIs.
- Frontend: React, react-router-dom, keycloak-js, axios, Vite, Vitest, Testing Library.
- Infra: Docker, docker-compose; PostgreSQL con PostGIS; opcional Keycloak como IdP de dev.

## Implementation Status
- **✅ FASE 1**: Persistencia completa (PostgreSQL + JPA + Flyway + Seeds)
- **✅ FASE 2**: APIs REST con JPA (repositorios reales, AuthFilter estandarizado, algoritmo de matching)
- **✅ FASE 3**: Tests de integración (Testcontainers configurado, 23 tests pasando)
- **🔄 FASE 4**: Docker-compose para desarrollo local (en progreso)
- **⏳ FASE 5**: Integraciones entre servicios (pendiente)
