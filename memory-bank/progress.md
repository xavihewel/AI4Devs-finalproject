# Progress

## What Works
- Documentación MVP en `doc/MVP` (contexto, contenedores, componentes, casos de uso, ER).
- Memory Bank alineado (product, patterns, tech, active, progress).
- Plan creado en `doc/plan/` (epics, user stories, tickets).
- Infraestructura local: `docker-compose.yml` (PostGIS, Redis, Keycloak, Mailhog), guía `doc/setup/local.md`.

## What's Left
- Configurar realms/clients de Keycloak para OIDC (dev) y variables de entorno.
- Especificar contratos base (OpenAPI) por microservicio.
- Priorizar e implementar tickets A1→U1→T1→B1→M1 con TDD.

## Current Status
Infraestructura local disponible y documentada; listo para iniciar configuración OIDC y primeras entidades/servicios.

## Known Issues
- Pendiente decisión fina de nomenclatura y paquetes Jakarta por servicio.
- Seeds iniciales (usuarios, sedes) por definir.
