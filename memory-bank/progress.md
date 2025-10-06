# Progress

## What Works
- Documentación MVP en `doc/MVP` (contexto, contenedores, componentes, casos de uso, ER).
- Memory Bank alineado (product, patterns, tech, active, progress).
- Plan creado en `doc/plan/` (epics, user stories, tickets).
- Infraestructura local: `docker-compose.yml` (PostGIS, Redis, Keycloak, Mailhog), guías `doc/setup/local.md`, `doc/setup/keycloak.md`, `doc/setup/env.md`.
- OpenAPI inicial: `doc/api/` (auth, users, trips, booking, matching).
- Estructura de repo: `Backend/` (microservicios con READMEs) y `Frontend/` (README).

## What's Left
- Configurar realm/clients de Keycloak en dev según guía.
- Implementar servicios siguiendo TDD a partir de OpenAPI.
- Seeds iniciales (usuarios, sedes) y scripts de migración.

## Current Status
Infra local, guías, contratos API y estructura de carpetas listos. Iniciar implementación por tickets A1→U1→T1→B1→M1.

## Known Issues
- Pendiente decisión fina de nomenclatura y paquetes Jakarta por servicio.
