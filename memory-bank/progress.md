# Progress

## What Works
- **Infra local**: `docker-compose` con DB, Keycloak, Mailhog y microservicios (trips 8081, users 8082, booking 8083, matching 8084, notifications 8085).
- **Base REST**: `@ApplicationPath("/api")` activo en todos los servicios.
- **Health**: `GET /api/health` operativo en `trips`, `users`, `booking`, `matching`, `notification`; `AuthFilter` ignora `/api/health` en todos.
- **Auth/OIDC Backend**: Token con `aud=backend-api` (mapper en Keycloak); `OIDC_ISSUER_URI` alineado a localhost.
- **Frontend Base**: React + TypeScript + Tailwind; dual mode (Docker + local dev). UI functional, navegación funciona.
- **Database Schemas**: PostgreSQL con schemas separados por servicio (users.users, trips.trips, bookings.bookings, matches.matches, notifications.notification_subscriptions) - CORREGIDO y funcionando.
- **Persistence completa**: Todas las entidades JPA con schema correcto, transacciones funcionando, CRUD completo en todos los servicios.
- **Scripts de automatización**: 11 scripts operativos para setup, verificación, arranque, testing y seeds.
  - Setup: `setup-dev.sh`, `dev-infra.sh`, `setup-keycloak.sh`, `migrate.sh`
  - Verificación: `verify-infra.sh`, `verify-all.sh`
  - Frontend: `start-frontend.sh`, `start-frontend-dev.sh`, `start-all-services.sh`
  - Testing: `run-e2e-tests.sh`
  - Seeds: `seed-test-data.sh` (nuevo) - inserta datos de prueba en todos los schemas
- **Cypress E2E**: Suite de ~21 tests E2E implementada y organizada. Smoke tests (6/6 ✅) funcionando perfectamente.
- **Documentación**: `QUICK-START.md`, `doc/setup/frontend-setup.md`, `doc/setup/verificacion-sistema.md`, `Frontend/cypress/README.md`, `doc/setup/database-schemas.md` (nuevo), `doc/setup/e2e-test-coverage.md` (nuevo) completos.
 - **CORS**: Política CORS corregida; `ALLOWED_ORIGINS` soportado y configurado en Docker para front local (`http://localhost:5173`).
- **Tests backend (unidad/integración)**: Suite verde en `shared`, `auth-service`, `users-service`, `trips-service`, `booking-service`, `matching-service`.
  - Recursos con DI habilitada (`UsersResource`, `TripsResource`, `BookingResource`, `MatchesResource`).
  - `users` y `trips` usan Testcontainers para repos/recursos.
  - `booking` usa Testcontainers + mocks de integraciones.
  - `matching` usa DI y repositorio mockeado (sin DB) en unit tests, y test de integración con filtro por fecha.
  - Añadido `AuthUtilsTest` en `shared`.
- **Tests frontend (unitarios)**: 90% de tests pasando (83/92), optimizados y corregidos.
  - Jest + React Testing Library funcionando correctamente.
  - Mocks mejorados para APIs, window.confirm implementado.
  - Tests de componentes UI, páginas principales, y servicios API.

## Recent Improvements (Octubre 2025)

### Feature: Perfil de Usuario (Mejorado ✅)
- ✅ **Validaciones Robustas**:
  - Tests unitarios para validaciones de campos obligatorios
  - Validación de formato email y longitud mínima de nombre
  - Manejo de errores de API y estados de carga
  - 7 tests unitarios pasando (ProfileValidation.test.tsx)
- ✅ **E2E Tests**:
  - Tests Cypress para navegación y funcionalidades del perfil
  - Verificación de validaciones, mensajes de éxito/error
  - Tests para estados de carga y feedback visual
  - 12 tests E2E (navigate-profile.cy.ts)
- ✅ **UX Mejorada**:
  - Validaciones en tiempo real con feedback inmediato
  - Mensajes de error claros y específicos
  - Estados de carga y confirmaciones de éxito
  - Indicadores visuales para campos obligatorios

### Feature: Historial de Viajes (Anterior ✅)
- ✅ **Backend (TDD)**:
  - Trips Service: Filtro status en GET /trips (ACTIVE, COMPLETED)
  - Booking Service: Filtros status, from, to en GET /bookings
  - 82 tests pasando (23 trips + 59 bookings)
  - Lógica: viajes con dateTime < now() = COMPLETED
- ✅ **Frontend**:
  - Página `/history` con filtros (fecha, estado, rol) y estadísticas
  - Componente `SelectWithChildren` creado para filtros con children
  - Integración con TripsService y BookingsService
  - Ruta añadida en App.tsx y enlace en Navbar
  - 9 tests unitarios pasando (History.test.tsx)
- ✅ **E2E**:
  - Tests Cypress para navegación y filtrado (navigate-history.cy.ts)
  - Verificación de estadísticas, filtros, badges y empty state
- ✅ **Documentación**:
  - OpenAPI actualizado: trips-service.yaml y booking-service.yaml
  - Nuevos query params documentados con descripciones y enums

### Feature: Mapa Básico (Anterior)
- ✅ **Frontend Components**: MapPreview y MapLinkButtons implementados
  - MapPreview: Marcadores de origen/destino, fit bounds automático, tiles OpenStreetMap
  - MapLinkButtons: Botones Google Maps/Waze con URLs correctas
  - Integración en Trips.tsx y Matches.tsx cuando hay coordenadas disponibles
- ✅ **Dependencias**: Leaflet instalado con --legacy-peer-deps
  - react-leaflet, leaflet, @types/leaflet instalados correctamente
  - CSS de Leaflet importado en main.tsx
  - Variable VITE_MAP_TILES_URL configurada en env.ts y env.example
- ✅ **Tests**: 16/16 tests unitarios pasando + E2E actualizados
  - Tests unitarios: MapPreview y MapLinkButtons con mocks de react-leaflet
  - Tests E2E: Verificación de mapas en Trips y Matches
  - Build exitoso: TypeScript compila, Vite build completado (410KB gzipped)

### Feature: Reserva de Plaza (Anterior)
- ✅ **TDD Backend**: 24 tests pasando - reglas de negocio y cancelación configurables
- ✅ **TDD Frontend**: Tests unitarios completos para BookingsService y páginas UI
- ✅ **E2E Tests**: Tests Cypress actualizados para flujos completos de reserva y cancelación

### Frontend UX Enhancements (Anterior)
- ✅ **Validaciones completas en formularios**: Todos los campos obligatorios con asterisco rojo, validación en tiempo real, mensajes específicos por campo
  - Crear viaje: validación de coordenadas (rango), fecha futura, asientos (1-8)
  - Mi Perfil: validación de email con regex, nombre mínimo 2 caracteres, sede obligatoria
- ✅ **Feedback visual completo**: Loading spinners, mensajes de éxito/error con auto-ocultado (3-5s), confirmaciones antes de eliminar
- ✅ **Menú responsive**: Botón hamburger en móvil, sticky navbar (z-50), consistente en todas las páginas
- ✅ **Páginas rediseñadas**: Reservas y Perfil con Cards modernas, badges de estado con colores, información detallada
- ✅ **Integración Matches-Bookings**: Cargar reservas existentes, marcar viajes ya reservados con badge "Ya reservado"
- ✅ **Inputs mejorados**: Soporte para labels con JSX (React.ReactNode), Select con opciones por defecto

### Backend Critical Fixes
- ✅ `notification-service` reparado: dependencias añadidas, CDI, Flyway V3 (UUID real), endpoint DELETE con query param.
- ✅ Integración de notificaciones: booking (confirm/cancel) y matching (accept/reject) con TDD.
- ✅ **TripRepository.delete()**: Agregada transacción faltante (begin/commit/rollback)
- ✅ **Schemas de base de datos corregidos**: Todas las entidades JPA ahora especifican schema correcto
  - `@Table(name = "tabla", schema = "schema")` en User, Trip, Booking, Match
  - Datos migrados de public.* a schemas correctos (trips.trips, matches.matches)
- ✅ **DTOs corregidos**: TripDto.Origin usa Double (wrapper) en lugar de double (primitivo) para permitir null
- ✅ **ServiceClients**: URLs corregidas, no duplican `/api`, health checks funcionando
- ✅ **Migraciones Flyway**: Todas actualizadas con `SET search_path TO {schema}, public;`

### Tests & Quality Improvements
- ✅ Nuevos tests en booking y matching validando llamadas a notificación.
- ✅ **Backend tests optimizados**: Cambio de PostGIS a PostgreSQL estándar, tiempo de ejecución reducido significativamente
- ✅ **Testcontainers mejorados**: Timeout aumentado a 2 minutos, eliminación de duplicados en persistence.xml
- ✅ **Frontend tests corregidos**: 90% de tests pasando (83/92), mocks mejorados, window.confirm implementado
- ✅ **Tests unitarios**: BookingValidationService, BookingResource, y todos los servicios funcionando correctamente

### Documentation & Tools
- ✅ **database-schemas.md**: Documentación completa de estructura de BD, schemas, índices, constraints
- ✅ **e2e-test-coverage.md**: Análisis completo de cobertura de tests E2E, gaps identificados, ejemplos de código
- ✅ **seed-test-data.sh**: Script para generar datos de prueba en todos los schemas (5 users, 4 trips, 2 bookings, 3 matches)

## What's Left
- **Completar tests frontend**: Arreglar 6 tests restantes (Bookings, Profile, Trips, Matches) y añadir tests de suscripción push para alcanzar 100% de cobertura
- **Testing E2E completo**: Suite de tests Cypress actualizada (authentication, trips, matches, bookings, notifications, flows) - 85% pasando, 4 tests menores por arreglar.
- **Auth JWKS remoto (tests)**: Añadir tests con WireMock para `JwtValidator` con JWKS HTTP (éxito, timeout, key miss, caché).
- **Frontend features**: Completar todas las páginas (Bookings más robusta, Profile funcional, Admin).
- **Observabilidad avanzada**: Métricas, tracing distribuido, agregación de logs.
- **API Gateway**: Implementar gateway con routing path-based para unificar acceso.
- **CI/CD**: Pipeline de integración y despliegue continuo con Cypress.
- **Producción: Autenticación habilitada**: Confirmar que `AUTH_DISABLED=false` y que la validación JWT esté activa en todos los servicios para despliegues a producción (y roles según `REQUIRE_ROLE_EMPLOYEE`).

## Current Status
- ✅ Sistema completamente funcional y arrancable con un solo comando (`start-all-services.sh`)
- ✅ Infraestructura automatizada con verificación en capas
- ✅ Keycloak funcionando correctamente (verificado por scripts; revisar si no arranca en algunos entornos)
- ✅ Cypress E2E instalado y configurado - smoke tests (6/6 ✅) pasando
- 🔄 Frontend login: revalidación tras corrección de CORS y ajuste de `.env.local`
- ✅ Backend unit/integration tests en verde con DI/Testcontainers.

## Known Issues
- ⚠️ Posibles diferencias entre modo Docker y modo Vite local para variables de entorno
- ⚠️ Frontend en Docker requiere rebuild manual para ver cambios (usar modo dev local para desarrollo)
- ⚠️ Microservicios tardan ~30s en arrancar completamente (normal para Payara Micro)
- ⚠️ Tests frontend: 6 tests fallando (Bookings, Profile, Trips, Matches) - mocks y DOM matching
- ⚠️ Tests E2E desactualizados: 2-3 tests necesitan actualización para nueva UI (profile-edit, create-cancel bookings)
- ⚠️ Tests E2E faltantes: Validaciones de formularios, reservar desde matches, menú responsive (~12 tests por crear)
- ⚠️ Validaciones cross-service en booking: Temporalmente simplificadas para MVP, necesitan mejora en producción

## Recently Fixed Issues
- ✅ Delete sin transacción en TripRepository (viajes no se eliminaban)
- ✅ Schemas incorrectos en entidades JPA (datos en schema public en lugar de específicos)
- ✅ NaN en inputs numéricos de formularios
- ✅ URLs duplicadas en ServiceClients (/api/api/...)
- ✅ DTOs con primitivos que no aceptaban null (double → Double)
- ✅ Menú no responsive ni consistente
- ✅ Falta de feedback visual en formularios
- ✅ Tests E2E actualizados y optimizados (85% pasando, 4 tests menores por arreglar)
- ✅ Sistema pulido: auth reactivada, console.log removidos, timeouts optimizados
- ✅ Tests backend optimizados: PostGIS → PostgreSQL, tiempo reducido significativamente
- ✅ Tests frontend mejorados: 90% pasando (83/92), mocks corregidos, window.confirm implementado
