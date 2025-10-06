# Active Context

## Current Focus
- **FASE 1 COMPLETADA**: Persistencia con PostgreSQL + JPA + Flyway implementada en todos los servicios.
- Migraciones probadas exitosamente: 4 servicios, 8 migraciones, 20 registros seed.
- Transición de repositorios in-memory a JPA con entidades reales.

## Recent Changes
- **Backend Parent POM**: Actualizado con dependencyManagement centralizado para JPA/Hibernate, PostgreSQL, Flyway, Testcontainers.
- **Docker Compose**: PostgreSQL configurado en puerto 5433 con PostGIS.
- **Migraciones Flyway**: Creadas para todos los servicios (trips, users, bookings, matches) con schemas separados.
- **Entidades JPA**: Implementadas `Trip`, `User`, `Booking`, `Match` con anotaciones completas.
- **Repositorios JPA**: Reemplazados repositorios in-memory con `TripRepository`, `UserRepository`, `BookingRepository`, `MatchRepository`.
- **Seeds realistas**: 5 registros por tabla con datos coherentes entre servicios.
- **Configuración JPA**: `persistence.xml` y `JpaConfig` para cada servicio con conexión a PostgreSQL.

## Next Steps
- **FASE 2**: Actualizar recursos REST para usar JPA en lugar de in-memory.
- **FASE 3**: Tests de integración con Testcontainers.
- **FASE 4**: Configurar docker-compose completo para desarrollo local.
- **FASE 5**: Integraciones entre servicios usando datos reales.

## Decisions & Considerations
- Tests de recursos devolviendo DTOs directamente para evitar `RuntimeDelegate`.
- Mantener OpenAPI como contrato guía; verificar campos clave en tests.
- Frontend usa Vite, react-router-dom, keycloak-js y axios; las variables se leen como `VITE_*` y el cliente adjunta automáticamente `Authorization: Bearer` a las llamadas.
