# Active Context

## Current Focus
- **FASES 1, 2, 3 y 4 COMPLETADAS**: Backend completamente funcional con persistencia real, APIs REST con JPA, tests de integración robustos, y entorno de desarrollo completo con Docker.
- **Preparando FASE 5**: Integraciones reales entre servicios.

## Recent Changes
### FASE 2 - APIs REST con JPA ✅
- **Recursos REST actualizados**: Todos los servicios migrados de repositorios in-memory a JPA real
- **AuthFilter estandarizado**: ThreadLocal AuthContext implementado en todos los servicios para propagación de userId
- **Algoritmo de matching real**: Implementado con scoring 0.0-1.0 basado en destino, tiempo, origen y disponibilidad de asientos
- **Validaciones REST**: Implementadas usando Jakarta Bean Validation
- **DTOs actualizados**: `BookingDto` incluye `seatsRequested`, `MatchDto` incluye campos detallados

### FASE 3 - Tests de integración ✅
- **Testcontainers configurado**: PostgreSQL + PostGIS para tests de integración con Docker
- **Tests de integración implementados**: Para todos los servicios con cobertura completa
  - trips-service: 4 tests (save/find, findByDestination, findAvailable, updateSeats)
  - users-service: 5 tests (save/find, findBySede, findByRole, update, findById)
  - booking-service: 6 tests (save/find, findByPassenger, findByTrip, findByStatus, updateStatus, findById)
  - matching-service: 8 tests (save/find, findByTrip, findByPassenger, findByDriver, findByStatus, findHighScore, findByTripAndPassenger, updateStatus)
- **Schemas separados**: Cada servicio con su propio schema en tests
- **Configuración dinámica**: EntityManager configurado dinámicamente para cada test

### FASE 4 - Docker-compose para desarrollo local ✅
- **Infraestructura Docker**: PostgreSQL+PostGIS (5434), Redis (6379), Keycloak (8080), Mailhog (8025/1025)
- **Microservicios dockerizados**: trips-service (8081), users-service (8082), booking-service (8083), matching-service (8084), frontend (3000)
- **Scripts automatización**: setup-dev.sh, dev-infra.sh, migrate.sh, setup-keycloak.sh
- **Dockerfiles multi-stage**: Optimizados para desarrollo y producción
- **Documentación completa**: doc/setup/local.md con guías detalladas y troubleshooting

## Next Steps
- **FASE 5**: Integraciones reales entre servicios
  - Matching service integrado con trips service
  - Booking service integrado con trips y users services
  - Validaciones cross-service
  - Manejo de transacciones distribuidas

## Decisions & Considerations
- **ThreadLocal AuthContext**: Patrón estándar para manejo de contexto de usuario en todos los servicios
- **Testcontainers**: Uso de PostgreSQL real en tests para verificar funcionalidad completa
- **Transacciones manuales**: RESOURCE_LOCAL para simplicidad del MVP
- **Business methods**: Implementados en entidades JPA para lógica de negocio (reserveSeats, accept, confirm, etc.)
- **Validaciones**: Jakarta Bean Validation para validación de entrada en REST APIs
- **Docker-compose**: Profiles para desarrollo opcional, scripts de automatización para setup completo
- **Puerto PostgreSQL**: Cambiado a 5434 para evitar conflictos con instalaciones locales
