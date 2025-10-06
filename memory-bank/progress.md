# Progress

## What Works
- Documentación MVP en `doc/MVP` (contexto, contenedores, componentes, casos de uso, ER).
- Memory Bank actualizado: `productContext.md`, `systemPatterns.md`, `techContext.md`, `activeContext.md` alineados con Java/Jakarta, React/TS, PostgreSQL y DDD/TDD/SOLID.

## What's Left
- Definir Epics y User Stories iniciales (DDD) y derivar tickets técnicos.
- Preparar `docker-compose` de dev (PostgreSQL, Redis, opcional Keycloak) y guía de instalación.
- Especificar contratos base (OpenAPI/PlantUML) para `/users`, `/trips`, `/bookings`, `/matches`.
- Crear `Prompts/prompts_xvb.md` y registrar próximas decisiones.

## Current Status
Memory Bank sincronizado con el prompt de trabajo y metodología. Listo para entrar en Planner Mode y definir epics/US/tickets antes de implementar (TDD).

## Known Issues
- Pendiente decisión fina sobre monolito modular vs. servicios iniciales (sugerido monolito modular Java 17 + Jakarta).
- Falta definir pipeline de CI y estándares de calidad (lint, tests, coverage).
