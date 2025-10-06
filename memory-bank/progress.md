# Progress

## What Works
- Documentación MVP en `doc/MVP` (contexto, contenedores, componentes, casos de uso, ER).
- Memory Bank alineado (product, patterns, tech, active, progress).
- Plan creado en `doc/plan/` (epics, user stories, tickets).
- Infraestructura local: `docker-compose.yml` (PostGIS, Redis, Keycloak, Mailhog), guía `doc/setup/local.md`.
- Keycloak dev: guía `doc/setup/keycloak.md`. Variables de entorno: `doc/setup/env.md`.

## What's Left
- Configurar realm/clients de Keycloak en dev según guía.
- Especificar contratos base (OpenAPI) por microservicio.
- Priorizar e implementar tickets A1→U1→T1→B1→M1 con TDD.

## Current Status
Infra local y guías listas (Keycloak/env). Listo para configurar OIDC y arrancar desarrollo por servicios.

## Known Issues
- Pendiente decisión fina de nomenclatura y paquetes Jakarta por servicio.
- Seeds iniciales (usuarios, sedes) por definir.
