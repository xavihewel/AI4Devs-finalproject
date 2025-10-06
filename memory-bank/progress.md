# Progress

## What Works
- Documentación MVP en `doc/MVP` (contexto, contenedores, componentes, casos de uso, ER).
- Memory Bank alineado (product, patterns, tech, active, progress).
- Plan creado en `doc/plan/` (epics, user stories, tickets).
- Infraestructura local: `docker-compose.yml` (PostGIS, Redis, Keycloak, Mailhog), guía `doc/setup/local.md`.
- Keycloak dev: guía `doc/setup/keycloak.md`. Variables de entorno: `doc/setup/env.md`.
- OpenAPI inicial: `doc/api/` (auth, users, trips, booking, matching).

## What's Left
- Configurar realm/clients de Keycloak en dev según guía.
- Implementar servicios siguiendo TDD a partir de OpenAPI.
- Seeds iniciales (usuarios, sedes) y scripts de migración.

## Current Status
Infra local, guías y contratos API listos. Iniciar implementación por tickets A1→U1→T1→B1→M1.

## Known Issues
- Pendiente decisión fina de nomenclatura y paquetes Jakarta por servicio.
