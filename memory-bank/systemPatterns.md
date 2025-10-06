# System Patterns

## Architecture Overview
- Context (C1): SPA Web/Móvil, Backend de dominio, Data Platform. Integraciones: SSO (OIDC/SAML), Email/Push, Mapas/Geocoding, Calendario, BI.
- Contenedores (C2): SPA (React/TS), API Gateway (OIDC), Servicios de Dominio: Users, Trips, Matching, Booking, Notifications, Admin; Data & Infra: PostgreSQL+PostGIS, Redis, Elastic/OpenSearch, Event Bus, DWH.
- Componentes (C3): Matching (Match API, Scoring Engine, Geo Index), Booking (Booking API, Orchestrator, State Machine), Event Bus y Workers de notificaciones.

## Key Patterns
- Edge Authentication via OIDC en gateway; RBAC interno por rol (Empleado, Admin RRHH, Moderador Seguridad).
- Event-driven para notificaciones y analítica (TX outbox; colas/bus de eventos).
- Geospatial scoring simplificado en MVP (sede + franja horaria), ampliable a desvío/ETA.
- Templates de notificación y recordatorios (T-60/T-15) disparados por eventos Booking.
- Privacidad por diseño: origen aproximado en perfil, ubicación temporal opcional.

## Technical Decisions
- PostgreSQL + PostGIS para persistencia transaccional y soporte geográfico básico.
- Redis para caché de sesiones/matching; Elastic/OpenSearch opcional para búsquedas.
- Monolito modular o pocos servicios inicialmente; evolución a microservicios si escala.
- Observabilidad: logs estructurados, tracing OTEL, métricas (p95 matching time, booking success rate).

## Diagrams
- Ver `doc/MVP/C1-Contexto.md`, `C2-Contenedores principales.md`, `C3-Componentes Matching y Booking.md` y `casos-de-uso.md`.
