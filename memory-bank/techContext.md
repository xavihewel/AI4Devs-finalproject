# Tech Context

## Stack
- Languages: TypeScript (frontend), one of Node.js/TypeScript or Python for backend.
- Frameworks: React (SPA/PWA), API Gateway with OIDC, optional workers.
- Libraries/Services: PostGIS, Redis, Elastic/OpenSearch (opcional), Event Bus (Kafka/RabbitMQ), Map APIs, Email/Push.

## Development Setup
- Frontend SPA (React/TS) con autenticación OIDC.
- Backend/API con endpoints: users, trips, matching, booking, notifications; integración SSO/IdP y mapas.
- Local services: PostgreSQL + PostGIS, Redis; opcional Elastic y Message Broker.
- Scripts: seed mínima (usuarios/sedes), migraciones (Flyway/Liquibase), OpenAPI base para `/trips`, `/bookings`, `/matches`.

## Constraints
- Privacidad: almacenar zona aproximada en perfil, compartir ubicación temporal solo bajo consentimiento.
- Cumplimiento: RGPD, cifrado en tránsito (TLS) y reposo; auditoría de acciones administrativas.

## Dependencies
- PostgreSQL 14+/PostGIS, Redis 6+, Elastic/OpenSearch opcional, Kafka/RabbitMQ opcional.
- Integraciones: IdP corporativo (OIDC/SAML), proveedor de email/push, proveedor de mapas/geocoding.
