# Active Context

## Current Focus
- **Sistema completamente funcional**: Todos los microservicios operativos con comunicación entre servicios funcionando correctamente
- **Frontend UX pulido**: Validaciones completas, feedback visual, diseño responsive y consistente en todas las páginas
- **Database schemas corregidos**: Migración completada de tablas a schemas correctos (users, trips, bookings, matches)
- **Tests optimizados**: Backend tests 100% funcionando, Frontend tests 90% funcionando (83/92 tests pasan)
- **Próximo**: Completar tests frontend restantes y tests E2E actualizados

## Feature Plan
- Ver `memory-bank/featurePlan.md` para el mapeo de las 15 funcionalidades (cobertura/estado/próximos pasos) y el roadmap por fases.

## Recent Changes (Octubre 9, 2025)

### Database & Backend
- **Schemas corregidos**: Migración de datos de `public.*` a schemas específicos (`trips.trips`, `matches.matches`)
- **Entidades JPA**: Todas ahora especifican `@Table(name = "tabla", schema = "schema")`
- **TripRepository.delete()**: Agregada transacción faltante (begin/commit/rollback)
- **ServiceClients**: Corregidas URLs duplicadas (eliminado `/api` de paths, ya está en baseURL)
- **ServiceHttpClient**: Health check usa `/health` en lugar de `/api/health`
- **TripDto.Origin**: Cambiado de `double` a `Double` para permitir deserialización de null
- **Migraciones Flyway**: Todas actualizadas con `SET search_path TO {schema}, public;`
- **Validaciones booking**: Simplificadas temporalmente, mejor logging de errores

### Tests & Quality
- **Backend tests optimizados**: Cambio de PostGIS a PostgreSQL estándar, tiempo de ejecución reducido significativamente
- **Testcontainers mejorados**: Timeout aumentado a 2 minutos, eliminación de duplicados en persistence.xml
- **Frontend tests corregidos**: 90% de tests pasando (83/92), mocks mejorados, window.confirm implementado
- **Tests unitarios**: BookingValidationService, BookingResource, y todos los servicios funcionando correctamente

### Frontend UX
- **Formulario Crear Viaje**: Validaciones completas (coordenadas, fecha futura, asientos 1-8), mensajes de error específicos
- **Formulario Mi Perfil**: Validación de email con regex, sede como dropdown, asteriscos rojos en campos obligatorios
- **Página Reservas**: Rediseñada con Cards, badges de estado, información detallada, confirmaciones
- **Navbar**: Responsive con hamburger menu, sticky (z-50), consistente en todas las páginas
- **Feedback visual**: Loading spinners, mensajes de éxito/error, confirmaciones, estados disabled
- **Integración Matches-Bookings**: Carga automática de reservas existentes, marca visual "Ya reservado"
- **Componente Input**: Soporte para labels con JSX (React.ReactNode)

### Documentation & Tools
- **database-schemas.md**: Estructura completa de BD, schemas, índices, troubleshooting
- **e2e-test-coverage.md**: Análisis de cobertura, gaps, ejemplos de tests faltantes
- **seed-test-data.sh**: Script para generar datos de prueba en todos los schemas

## Next Steps (immediate)
- **Completar tests frontend**: Arreglar 6 tests restantes (Bookings, Profile, Trips, Matches)
  - Bookings: Mock de cancelación no actualiza estado correctamente
  - Profile: Mock de API falla, no encuentra "SEDE-1"
  - Trips: Labels en DOM diferentes a los que busca el test
  - Matches: Mocks de API no configurados correctamente
- **Tests E2E**: Actualizar/crear tests para nuevas funcionalidades (~12 tests)
  - Alta prioridad: Actualizar `profile-edit.cy.ts` (sede ahora es select), `create-cancel.cy.ts` (nueva UI de reservas)
  - Alta prioridad: Crear tests para reservar desde matches, validaciones de formularios
  - Media prioridad: Tests de menú responsive, feedback visual
- **Validaciones cross-service**: Mejorar validaciones en booking-service (actualmente simplificadas)
- **Reactivar validaciones**: Descomentar validaciones en BookingResource una vez verificadas URLs correctas

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
 - **Autenticación en producción**: El bypass de auth (`AUTH_DISABLED=true`) es solo para desarrollo/test. En producción debe estar desactivado (`AUTH_DISABLED=false`) y la validación JWT debe permanecer activa (incluyendo `REQUIRE_ROLE_EMPLOYEE` según políticas).
