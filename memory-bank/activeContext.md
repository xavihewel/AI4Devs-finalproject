# Active Context

## Current Focus
- **FASES 1, 2, 3, 4 y 5 COMPLETADAS**: Backend completamente funcional con persistencia real, APIs REST con JPA, tests de integración robustos, integraciones entre servicios, y entorno de desarrollo completo con Docker.
- **FRONTEND BASE COMPLETADO**: React + TypeScript + Tailwind CSS con componentes principales implementados.
- **Próximo objetivo**: Completar funcionalidades frontend restantes (bookings, perfil, autenticación OIDC).

## Recent Changes
### P1 - Autenticación OIDC Frontend ✅
- **Env loader**: Acepta `VITE_OIDC_ISSUER` y `VITE_OIDC_ISSUER_URI` para compatibilidad.
- **AuthProvider**: `login`/`logout` usan `getKeycloak()` de forma segura; refresh programado.
- **Axios interceptor**: Refresca token con `updateToken(5)` antes de cada request e inyecta `Authorization: Bearer`.
- **Routing**: Ruta `/callback` presente; `Protected` invoca `login()` si no autenticado.
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

### FASE 5 - Integraciones entre servicios ✅
- **Cliente HTTP compartido**: ServiceHttpClient para comunicación entre microservicios
- **DTOs compartidos**: TripDto, UserDto para comunicación estandarizada
- **Integración matching-service ↔ trips-service**: Datos reales en lugar de mocks
- **Integración booking-service ↔ trips + users services**: Validaciones cross-service
- **Servicio de validación**: BookingValidationService para validaciones entre servicios
- **Variables de entorno**: URLs de servicios configuradas en docker-compose
- **Health checks**: Endpoints /health para verificación de disponibilidad
- **Tests de integración**: Tests mockeados para comunicación entre servicios

### FRONTEND DEVELOPMENT - Base implementada ✅
- **Arquitectura moderna**: React 19, TypeScript, Vite, Tailwind CSS
- **Tipos TypeScript**: DTOs completos sincronizados con backend
- **Servicios API**: TripsService, UsersService, BookingsService, MatchesService
- **Componentes UI**: Button, Card, Input, LoadingSpinner reutilizables
- **Layout responsive**: Navbar con autenticación, Layout consistente
- **Páginas implementadas**: Home (hero + features), Trips (formulario + lista), Matches (búsqueda + scoring)
- **UX moderna**: Estados de carga, empty states, formularios validados

## Next Steps
- **Frontend**: 
  - Implementar gestión de bookings (página Bookings)
  - Completar autenticación OIDC con Keycloak
  - Implementar página de perfil de usuario
  - Tests de integración frontend-backend
  - Validar flujo de refresh silencioso en navegación y reintentos HTTP

## Decisions & Considerations
- **ThreadLocal AuthContext**: Patrón estándar para manejo de contexto de usuario en todos los servicios
- **Testcontainers**: Uso de PostgreSQL real en tests para verificar funcionalidad completa
- **Transacciones manuales**: RESOURCE_LOCAL para simplicidad del MVP
- **Business methods**: Implementados en entidades JPA para lógica de negocio (reserveSeats, accept, confirm, etc.)
- **Validaciones**: Jakarta Bean Validation para validación de entrada en REST APIs
 - **Frontend testing**: Jest + React Testing Library con `jsdom` y `jest-dom`; mocking de `getKeycloak()` para tests sin OIDC real
- **Docker-compose**: Profiles para desarrollo opcional, scripts de automatización para setup completo
- **Puerto PostgreSQL**: Cambiado a 5434 para evitar conflictos con instalaciones locales
- **Integraciones entre servicios**: ServiceHttpClient para comunicación HTTP con manejo de errores
- **Frontend moderno**: React + TypeScript + Tailwind CSS para UI consistente y escalable
- **Componentes reutilizables**: Biblioteca de UI con variantes y estados para consistencia
- **Servicios API**: Clases dedicadas para cada microservicio con tipos estrictos
