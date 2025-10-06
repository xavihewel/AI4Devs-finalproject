# System Patterns

## Architecture Overview
- Context (C1): SPA Web/Móvil (React/TS), Backend Java 17 + Jakarta (dominio), Data Platform. Integraciones: SSO (OIDC/SAML), Email/Push, Mapas/Geocoding, Calendario, BI.
- Contenedores (C2): SPA, API Gateway (OIDC), Servicios: Users, Trips, Matching, Booking, Notifications, Admin; Data & Infra: PostgreSQL+PostGIS, Redis, Elastic/OpenSearch, Event Bus, DWH.
- Componentes (C3): Matching (Match API, Scoring Engine, Geo Index), Booking (Booking API, Orchestrator, State Machine), Event Bus y Workers.

## DDD Layers and Structure
- Domain: entidades/agregados, repositorios (interfaces), servicios de dominio, eventos de dominio.
- Application: casos de uso (servicios de aplicación), orquestación, DTOs/comandos, transacciones.
- Infrastructure: adaptadores (REST JAX‑RS, persistencia JPA/Hibernate, mensajería), configs, mappers.
- Interface: controladores/recursos (JAX‑RS), validación, auth (OIDC), serialización.

## TDD Workflow
1) Definir casos de uso y criterios de aceptación. 2) Escribir tests de aplicación y dominio (JUnit5/Mockito). 3) Implementar lo mínimo para pasar tests. 4) Refactor con SOLID. 5) Añadir tests de integración (repos JPA, recursos JAX‑RS) y contratos.

## Key Patterns
- Edge Authentication via OIDC; RBAC interno por rol.
- Event-driven para notificaciones/analítica (TX outbox + bus). 
- Geospatial scoring simplificado en MVP; ampliable a desvío/ETA.
- Notificaciones basadas en eventos (BookingConfirmed, recordatorios T‑60/T‑15).
- Privacidad por diseño: zona aproximada; ubicación temporal.
 - Frontend SPA: OIDC (Keycloak) con PKCE, almacenamiento de token en memoria (keycloak-js), routing con `react-router-dom`, cliente HTTP Axios con `Authorization: Bearer` inyectado por interceptor.
 - Frontend Testing: Vitest + RTL; entorno `jsdom` y `jest-dom`; mocking de `getKeycloak()` para tests sin OIDC real.

## Technical Decisions
- Backend en Java 17 + Jakarta; Maven como build. JPA/Hibernate con PostgreSQL/PostGIS.
- Redis para caché; Elastic/OpenSearch opcional; Keycloak como IdP en dev.
- Observabilidad: logs estructurados, tracing OTEL, métricas clave.
 - Frontend usa Vite para dev/build; variables de entorno `VITE_*` para configuración OIDC y base URL.

## Collaboration and Documentation
- Mantener documentación en `/doc` (PlantUML/Mermaid) y prompts en `/Prompts/prompts_xvb.md`.
- Flujo: Epics/US → tickets técnicos → modelos/diagramas → tests (TDD) → implementación → actualizar doc y prompts.

## Diagrams
- Ver `doc/MVP/*` y `readme.md` para contexto ampliado.
