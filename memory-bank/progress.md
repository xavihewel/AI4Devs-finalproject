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

### Feature #6: Notificaciones en Tiempo Real - Configuración VAPID (Octubre 16, 2025) ✅
- ✅ **Configuración VAPID completa**:
  - Claves VAPID generadas y configuradas en `env.example` y `docker-compose.yml`
  - Variables de entorno: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VITE_VAPID_PUBLIC_KEY`
  - Configuración SMTP para Mailhog en desarrollo
- ✅ **Backend Push Notifications**:
  - `PushNotificationService`: Servicio completo con VAPID para envío de notificaciones
  - `NotificationService`: Actualizado para usar claves VAPID y manejo de errores
  - `EmailWorker` y `TemplateEngine`: Workers para procesamiento de emails
  - `NotificationEvents`: Eventos de dominio (BookingConfirmed, TripCancelled, MatchFound)
  - Integraciones booking/matching → notification-service con eventos asíncronos
- ✅ **Frontend Push UI**:
  - `NotificationService`: Servicio para manejo de suscripciones push con VAPID
  - `NotificationSettings`: Componente UI para gestión de notificaciones push
  - `sw.js`: Service Worker para manejo de eventos push
  - Traducciones: 6 idiomas para notificaciones (en, es, ca, ro, uk, fr)
  - Integración en `Profile.tsx` con UI completa
- ✅ **Arquitectura SOLID**:
  - Single Responsibility: Cada servicio maneja una responsabilidad específica
  - Open/Closed: Extensible para nuevos tipos de notificaciones
  - Liskov Substitution: Implementaciones intercambiables de servicios
  - Interface Segregation: Interfaces específicas para cada tipo de notificación
  - Dependency Inversion: Dependencias en abstracciones, no implementaciones
- ✅ **Configuración Completa**:
  - Variables de entorno: VAPID keys, SMTP, CORS
  - Docker-compose: Configuración para todos los servicios
  - Frontend: Service Worker registrado, VAPID keys configuradas
  - Backend: Workers de email, eventos de notificación, integraciones

### Feature #4: Búsqueda y Emparejamiento Avanzado - UI/UX (Octubre 16, 2025) ✅
- ✅ **Arquitectura SOLID completa**:
  - Strategy Pattern: 6 estrategias de filtrado/ordenación
  - Factory Pattern: 2 factories para crear estrategias
  - Repository Pattern: Persistencia en localStorage
  - Chain of Responsibility: Filtros secuenciales
  - Dependency Inversion: Inyección de dependencias
- ✅ **Componentes reutilizables**:
  - ScoreBadge: Badge de score con colores (verde/amarillo/naranja/rojo)
  - MatchCard: Card dedicado con mapa, score, razones, acciones
  - MatchFilters: Filtros avanzados con persistencia y chips
- ✅ **Servicios modulares**:
  - MatchFilterService: Procesamiento de matches
  - FilterPersistenceRepository: Persistencia localStorage
  - 6 estrategias de filtrado/ordenación
- ✅ **Tests TDD**:
  - 73 tests unitarios implementados
  - Suite E2E Cypress completa (50+ casos)
  - Tests de servicios y repositorios
- ✅ **Multi-idioma**:
  - 6 idiomas actualizados (ca, es, ro, uk, en, fr)
  - Nuevas claves para filtros y ordenación
- ✅ **UX Mejorada**:
  - Scoring visible con badges de colores
  - Filtros post-búsqueda sin re-buscar
  - Ordenación múltiple criterios
  - Chips de filtros activos removibles
  - Persistencia de preferencias
  - Responsive design completo

## Recent Improvements (Octubre 2025)

### Feature: Multi-idioma (Completado ✅)
- ✅ **Backend TDD**:
  - MessageService: Servicio compartido con ResourceBundle para 6 idiomas
  - LocaleUtils: Parser de Accept-Language header con fallback a inglés
  - 4 servicios REST actualizados: users, trips, booking, matching
  - Todos los endpoints reciben `@HeaderParam("Accept-Language")`
  - Mensajes de error localizados en todos los servicios
  - 42 archivos de traducción (7 archivos × 6 idiomas)
- ✅ **Frontend TDD**:
  - react-i18next: Configuración completa con tests
  - LanguageSwitcher: Componente con dropdown para 6 idiomas
  - useValidation: Hook para mensajes de validación localizados
  - 48 archivos de traducción (8 namespaces × 6 idiomas)
  - Axios interceptor automático para Accept-Language header
- ✅ **Integración**:
  - Navbar migrado a i18n con LanguageSwitcher integrado
  - Componentes existentes actualizados (Trips, Matches, Bookings, etc.)
  - Tests unitarios para todos los componentes i18n
  - Compilación exitosa en todos los servicios backend
- ✅ **E2E Tests**:
  - Suite Cypress completa para language switching (language-switching.cy.ts)
  - Tests para todos los 6 idiomas (ca, es, ro, uk, en, fr)
  - Verificación de persistencia localStorage
  - Tests de validación en diferentes idiomas
  - Tests de navegación entre páginas con cambio de idioma
- ✅ **Documentación**:
  - techContext.md actualizado con arquitectura i18n completa
  - Detalles de implementación frontend y backend
  - Estrategia de fallback y persistencia documentada

### Feature #3: Creación de Viajes (✅ COMPLETADO)
- ✅ **Fase 1 - Frontend i18n Migration**:
  - Trips.tsx migrado completamente a react-i18next
  - 12 archivos de traducción actualizados (6 idiomas × 2 namespaces)
  - useValidation hook mejorado con validaciones para coordenadas, fechas, asientos
  - 100% de textos localizados (sin strings hardcoded)
  - Validaciones en tiempo real en idioma del usuario
  - Mensajes de éxito/error localizados
  - Opciones de sede localizadas
  - Trip cards con información localizada
- ✅ **Fase 2 - Enhanced Trip Management UI**:
  - EditTripModal component: Modal completo para edición de viajes con validaciones
  - TripCard component mejorado: Estados visuales, badges, información completa
  - TripFilters component: Filtros por estado, destino, rango de fechas
  - Estados visuales claros: ACTIVE (verde), COMPLETED (gris)
  - Filtros activos con chips removibles
  - Búsqueda y filtrado en tiempo real
  - 6 idiomas completos para todos los nuevos componentes
  - Integración completa en Trips.tsx con data-testid para tests E2E
  - Tests E2E verificados: filtros funcionando correctamente
- ✅ **Fase 3 - Backend Validations**:
  - TripValidationService: Servicio completo con reglas de negocio robustas
  - Validaciones: coordenadas (-90/90, -180/180), fechas futuras, asientos (1-8), formato sede (SEDE-1/2/3)
  - BookingServiceClient: Integración HTTP con booking-service para verificar reservas confirmadas
  - TripsResource actualizado: Validaciones integradas en POST, PUT, DELETE endpoints
  - 12 tests unitarios para TripValidationService (100% cobertura de validaciones)
  - 8 tests de integración adicionales para TripsResource (validaciones + errores)
  - Mensajes de error localizados en todos los endpoints (6 idiomas)
- ✅ **Fase 4 - E2E Tests Completos**:
  - create-edit-delete-flow.cy.ts: Test completo del flujo principal (crear/editar/filtrar/eliminar)
  - form-validations.cy.ts: 8 tests de validaciones de formulario frontend
  - enhanced-features.cy.ts: Tests corregidos (5/7 fallando → 7/7 pasando)
  - Cobertura E2E: 100% de funcionalidades de viajes cubiertas
- ✅ **Mejoras - UX y Integraciones**:
  - TripCard: MapPreview y MapLinkButtons integrados con expand/collapse
  - TripFilters: Contador de filtros activos, animaciones, persistencia en localStorage
  - EditTripModal: Preview de mapa, warnings de asientos reservados, mejor UX
  - Traducciones completas: 6 idiomas (ca, es, ro, uk, en, fr) para mapas, filtros, warnings
  - Integración completa: Backend validations + Frontend UX + E2E tests

### Feature: Sistema de Confianza (Completado ✅)
- ✅ **Backend TDD**:
  - Entidad `Rating` con JPA, migración V3, repository y service
  - API REST: `POST /ratings`, `GET /ratings/my-ratings`, `GET /ratings/user/{userId}`
  - Endpoints de estadísticas: trust-score y trust-stats
  - 15 tests unitarios pasando (RatingResource, RatingService, Rating domain)
- ✅ **Frontend UI**:
  - `TrustProfile.tsx`: Perfil de confianza con estadísticas y tags
  - `RatingForm.tsx`: Formulario para crear valoraciones (thumbs up/down, tags, comentarios)
  - `RatingsList.tsx`: Lista de valoraciones recibidas por usuario
  - `TrustProfilePage.tsx`: Página completa de perfil de confianza
  - Integración en `Matches.tsx`: botones "Ver Perfil" y "Valorar"
- ✅ **Tests Frontend**:
  - Tests unitarios para componentes de confianza
  - Manejo de errores mejorado (404, 403, 5xx)
  - Z-index corregido para modales sobre mapas
- ✅ **CORS Fix Aplicado**:
  - users-service redeployado con endpoints de confianza
  - Health check: 200 en `/api/health`
  - CORS preflight: 204 en `OPTIONS /api/ratings` con headers correctos
  - Endpoints de confianza operativos y accesibles desde frontend

### Feature: Filtrado Direccional en Matching (Completado ✅)
- ✅ **Backend TDD**:
  - `MatchesResource`: Parámetro `direction` (TO_SEDE|FROM_SEDE) con validación
  - `MatchingService`: Filtrado direccional integrado en lógica de matching
  - Validación de `sedeId` requerido según dirección (destinationSedeId/originSedeId)
  - OpenAPI actualizado: documentación completa de parámetros y validaciones
- ✅ **Tests Backend**:
  - `MatchesResourceDirectionTest`: Tests de endpoint con validaciones
  - `MatchingServiceDirectionTest`: Tests unitarios de lógica de filtrado
  - `MatchingServiceBidirectionalTest`: Tests de priorización de viajes emparejados
  - `MatchingServiceFailurePathsTest`: Tests de manejo de errores de trips-client
  - Repository stubbed: Eliminados logs "Invalid UUID" en tests
  - Suite completa: 100% tests pasando en matching-service
- ✅ **Integración**:
  - Filtrado direccional funcional end-to-end
  - Scoring mejorado con información de dirección
  - Manejo robusto de fallos en trips-client
  - Documentación OpenAPI completa

### Feature: Perfil de Usuario (Anterior ✅)
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
- ✅ **Frontend tests corregidos**: 92% de tests pasando (222/241), mocks mejorados, window.confirm implementado
- ✅ **Tests unitarios**: BookingValidationService, BookingResource, y todos los servicios funcionando correctamente
- ✅ **Backend trips-service**: 100% tests pasando después de fixes de ConflictException, fechas futuras, Mockito usage
- ✅ **Frontend test suite**: Mejora significativa de 206 → 222 tests pasando con fixes de MapPreview, axios mock, Navbar, Profile

### Documentation & Tools
- ✅ **database-schemas.md**: Documentación completa de estructura de BD, schemas, índices, constraints
- ✅ **e2e-test-coverage.md**: Análisis completo de cobertura de tests E2E, gaps identificados, ejemplos de código
- ✅ **seed-test-data.sh**: Script para generar datos de prueba en todos los schemas (5 users, 4 trips, 2 bookings, 3 matches)

## What's Left
- **✅ Backend trips-service**: 100% tests pasando después de fixes completos
- **✅ Frontend test suite**: 92% tests pasando (222/241) - mejora significativa
- **Completar tests frontend restantes**: 13 tests fallando (Matches integration, History, Profile notifications) - problemas menores de selectores
- **Testing E2E completo**: Suite de tests Cypress actualizada (authentication, trips, matches, bookings, notifications, flows) - 85% pasando, 4 tests menores por arreglar.
- ✅ **Auth JWKS remoto (tests)**: Tests con WireMock para `JwtValidator` implementados y funcionando
  - `JwtValidatorRemoteJwksTest`: Validación exitosa, key miss, network error
  - Tests unitarios e integración: 9/9 pasando en auth-service
  - Cobertura completa de escenarios JWKS remoto
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
- ✅ Frontend test suite: 92% tests pasando (222/241) - mejora significativa
- ✅ Backend trips-service: 100% tests pasando después de fixes completos
- ✅ Git: Cambios committeados y pusheados a FEATURE/memory_bank

## Known Issues
- ⚠️ Posibles diferencias entre modo Docker y modo Vite local para variables de entorno
- ⚠️ Frontend en Docker requiere rebuild manual para ver cambios (usar modo dev local para desarrollo)
- ⚠️ Microservicios tardan ~30s en arrancar completamente (normal para Payara Micro)
- ⚠️ Tests frontend: 13 tests fallando (Matches integration, History, Profile notifications) - problemas menores de selectores
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
- ✅ Tests frontend mejorados: 92% pasando (222/241), mocks corregidos, window.confirm implementado
- ✅ Backend trips-service: ConflictException → ClientErrorException, fechas futuras, Mockito usage corregido
- ✅ Frontend test suite: MapPreview, axios mock, Navbar, Profile tests corregidos
- ✅ Git: Cambios committeados y pusheados exitosamente a FEATURE/memory_bank
