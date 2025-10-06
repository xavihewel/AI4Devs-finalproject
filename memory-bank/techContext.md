# Tech Context

## Stack
- Languages: Java 17 (backend), TypeScript (frontend).
- Backend: Jakarta EE on Java 17, Maven (v10) build, JUnit 5 + Mockito for tests.
- Frontend: React (SPA/PWA) con TypeScript.
- Optional edge/server: Node.js + Express para middleware o herramientas dev.
- Database: PostgreSQL (con PostGIS si se requiere geo), Redis opcional.

## Development Setup
- Backend (Java 17 + Jakarta + Maven): estructura según DDD (módulos dominio, aplicación, infraestructura); pruebas con JUnit5/Mockito via Maven surefire; perfiles de configuración (dev/test).
- Frontend (React/TS): autenticación OIDC, PWA opcional; scripts de desarrollo y build.
- Servicios locales: PostgreSQL, Redis; docker-compose recomendado para orquestación.
- Documentación técnica en `/doc` con PlantUML y Mermaid; prompts en `/Prompts/prompts_xvb.md`.

## Constraints
- DDD/TDD/SOLID como guía: pruebas antes de código funcional; límites de contexto claros; separación de capas.
- Privacidad y cumplimiento (RGPD): almacenar zona aproximada; cifrado en tránsito/ reposo.

## Dependencies
- Maven: Jakarta EE API, JAX-RS, JPA/Hibernate, PostgreSQL driver, JUnit5, Mockito.
- Frontend: React, react-router, OIDC/OAuth client, tooling (Vite/CRA), testing-library/Jest.
- Infra: Docker, docker-compose; opcional Keycloak como IdP de dev.
