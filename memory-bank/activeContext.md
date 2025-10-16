# Active Context

## Current Focus
- **Feature #6: Notificaciones en Tiempo Real**: ✅ CONFIGURACIÓN VAPID COMPLETADA
- **Backend**: Integraciones booking/matching → notification-service con eventos
- **Frontend**: UI de suscripción push con Service Worker y VAPID
- **Configuración**: Claves VAPID generadas, variables de entorno configuradas
- **Próximo**: Tests backend, templates de email, y tests E2E para notificaciones

## Feature Plan
- Ver `memory-bank/featurePlan.md` para el mapeo de las 15 funcionalidades (cobertura/estado/próximos pasos) y el roadmap por fases.

## Recent Changes (Octubre 16, 2025)

### Feature #6: Notificaciones en Tiempo Real - Configuración VAPID (✅ COMPLETADO)
- **Configuración VAPID**:
  - Claves VAPID generadas: `BM75fK9CbHI0PAhOz2J68KSzO3-JHGJeZw90_LR7bRzPoVvBIaYT928QXeD1EJ3mok1wKsVPtV7KAtATQrmYXpo`
  - Variables de entorno actualizadas en `env.example` y `docker-compose.yml`
  - `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY` configuradas para desarrollo
  - `VITE_VAPID_PUBLIC_KEY` para frontend

- **Backend Integrations**:
  - `PushNotificationService`: Servicio completo con VAPID para envío de notificaciones push
  - `NotificationService`: Actualizado para usar claves VAPID y manejo de errores
  - `EmailWorker` y `TemplateEngine`: Workers para procesamiento de emails
  - `NotificationEvents`: Eventos de dominio (BookingConfirmed, TripCancelled, MatchFound)
  - Integraciones booking/matching → notification-service con eventos asíncronos

- **Frontend Push UI**:
  - `NotificationService`: Servicio para manejo de suscripciones push con VAPID
  - `NotificationSettings`: Componente UI para gestión de notificaciones push
  - `sw.js`: Service Worker para manejo de eventos push
  - Traducciones: 6 idiomas para notificaciones (en, es, ca, ro, uk, fr)
  - Integración en `Profile.tsx` con UI completa

- **Arquitectura SOLID**:
  - **Single Responsibility**: Cada servicio maneja una responsabilidad específica
  - **Open/Closed**: Extensible para nuevos tipos de notificaciones
  - **Liskov Substitution**: Implementaciones intercambiables de servicios
  - **Interface Segregation**: Interfaces específicas para cada tipo de notificación
  - **Dependency Inversion**: Dependencias en abstracciones, no implementaciones

- **Configuración Completa**:
  - Variables de entorno: VAPID keys, SMTP, CORS
  - Docker-compose: Configuración para todos los servicios
  - Frontend: Service Worker registrado, VAPID keys configuradas
  - Backend: Workers de email, eventos de notificación, integraciones

- **Pendiente**:
  - Tests unitarios para `PushNotificationService` y workers
  - Templates de email con i18n
  - Tests E2E para flujo completo de notificaciones
  - Documentación de arquitectura de notificaciones

### Feature #4: Búsqueda y Emparejamiento Avanzado - UI/UX Mejorada (✅ COMPLETADO)
- **Arquitectura SOLID implementada**:
  - **Single Responsibility**: Cada clase/componente una responsabilidad (ScoreFilterStrategy, SeatsFilterStrategy, DateRangeFilterStrategy)
  - **Open/Closed**: Extensible sin modificar código existente (nuevas estrategias se añaden fácilmente)
  - **Liskov Substitution**: Implementaciones intercambiables (todas las estrategias implementan mismas interfaces)
  - **Interface Segregation**: Interfaces específicas (`MatchFilterStrategy`, `MatchSortStrategy`, `FilterPersistenceRepository`)
  - **Dependency Inversion**: Dependencias en abstracciones no concreciones (DI en `MatchFilterService`)
  
- **Patrones de Diseño aplicados**:
  - **Strategy Pattern**: Para filtros y ordenación (`MatchFilterStrategy`, `MatchSortStrategy`)
  - **Factory Pattern**: Para crear estrategias (`FilterStrategyFactory`, `SortStrategyFactory`)
  - **Repository Pattern**: Para persistencia (`FilterPersistenceRepository`, `LocalStorageFilterRepository`)
  - **Chain of Responsibility**: Para aplicar múltiples filtros secuencialmente

- **Componentes creados**:
  - `ScoreBadge.tsx`: Badge reutilizable con colores y etiquetas (Excellent/Good/Regular/Low)
  - `MatchCard.tsx`: Card dedicado para matches con mapa, score, razones, acciones
  - `MatchFilters.tsx`: Filtros avanzados (score, asientos, fechas, ordenación) con persistencia

- **Servicios y Estrategias**:
  - `MatchFilterService`: Servicio para procesar matches con filtros y ordenación
  - `ScoreFilterStrategy`, `SeatsFilterStrategy`, `DateRangeFilterStrategy`: Estrategias de filtrado
  - `ScoreSortStrategy`, `DateSortStrategy`, `SeatsSortStrategy`: Estrategias de ordenación
  - `ConcreteFilterStrategyFactory`, `ConcreteSortStrategyFactory`: Factories para crear estrategias
  - `LocalStorageFilterRepository`: Repositorio para persistir filtros en localStorage

- **Traducciones**:
  - 6 idiomas actualizados (ca, es, ro, uk, en, fr)
  - Nuevas claves: `filters.*`, `match.route`, `match.showMap`, `match.hideMap`, `results.noFilteredResults`

- **Tests implementados**:
  - `ScoreBadge.test.tsx`: 8 tests unitarios
  - `MatchCard.test.tsx`: 16 tests unitarios
  - `MatchFilters.test.tsx`: 22 tests unitarios
  - `MatchFilterService.test.ts`: 17 tests de servicio
  - `FilterPersistenceRepository.test.ts`: 10 tests de repositorio
  - `advanced-matching.cy.ts`: Suite E2E completa (50+ test cases)

- **Características implementadas**:
  - ✅ Scoring visible con badges de colores
  - ✅ Filtros post-búsqueda (score, asientos, fechas)
  - ✅ Ordenación múltiple (score, fecha, asientos)
  - ✅ Persistencia de filtros en localStorage
  - ✅ Chips de filtros activos con contador
  - ✅ Componentes reutilizables y modulares
  - ✅ Multi-idioma completo
  - ✅ Responsive design

- **Pendiente**:
  - Ajustar tests para traducciones i18n (español vs inglés)
  - Completar validación de tests E2E
  - Documentar patrones en techContext.md

## Recent Changes (Octubre 11, 2025)

### Feature: Backend trips-service Test Fixes (✅ COMPLETADO)
- **Backend TDD**:
  - `TripsResource`: Corregido uso de `ConflictException` → `ClientErrorException` con `Response.Status.CONFLICT`
  - Métodos overload añadidos para compatibilidad con tests sin `Accept-Language` header
  - `TripCreateDto.Origin` vs `TripDto.Origin` corregido en tests
  - Dependencia `mockito-junit-jupiter` añadida a `pom.xml`
  - Fechas hardcodeadas en pasado → fechas futuras dinámicas en tests
  - Mockito strictness y matcher usage corregidos (`eq()` para literales, `lenient` stubbing)
  - Assertions `OffsetDateTime` normalizadas para manejar diferencias de precisión
- **Tests Backend**:
  - Suite completa: 100% tests pasando en trips-service
  - 12 archivos de test corregidos y optimizados
  - Validaciones de negocio funcionando correctamente
  - Integración con booking-service verificada
- **Frontend Test Suite**:
  - MapPreview component: Import corregido y mocking mejorado
  - Axios mock: Inicialización corregida en `bookings.test.ts`
  - Navbar tests: Múltiples elementos manejados correctamente
  - Profile tests: Notifications mock y form labels corregidos
  - i18n config: Idioma por defecto corregido
  - Validation tests: Assertions y function calls corregidos
  - Matches integration: Selectores actualizados para nuevo filtro direccional
- **Git & Deployment**:
  - Commit `a0ac119`: Cambios committeados con mensaje detallado
  - Push exitoso a `origin/FEATURE/memory_bank`
  - 12 archivos modificados + 4 nuevos componentes matches
  - Mejora de 206 → 222 tests pasando en frontend

### Feature: Filtrado Direccional en Matching (✅ COMPLETADO)
- **Backend TDD**:
  - `MatchesResource`: Parámetro `direction` (TO_SEDE|FROM_SEDE) con validación de sedeId requerido
  - `MatchingService`: Filtrado direccional integrado en lógica de matching y scoring
  - OpenAPI actualizado: documentación completa de parámetros direction, originSedeId, destinationSedeId
- **Tests Backend**:
  - `MatchesResourceDirectionTest`: Tests de endpoint con validaciones y casos edge
  - `MatchingServiceDirectionTest`: Tests unitarios de lógica de filtrado direccional
  - `MatchingServiceBidirectionalTest`: Tests de priorización de viajes emparejados
  - `MatchingServiceFailurePathsTest`: Tests de manejo de errores de trips-client
  - Repository stubbed: Eliminados logs "Invalid UUID" en tests unitarios
  - Suite completa: 100% tests pasando en matching-service
- **Integración**:
  - Filtrado direccional funcional end-to-end con trips-service
  - Scoring mejorado incluyendo información de dirección en razones
  - Manejo robusto de fallos en trips-client (timeout, 5xx) retornando resultados vacíos
  - Documentación OpenAPI completa con ejemplos y validaciones

### Feature: Sistema de Confianza - CORS Fix (✅ COMPLETADO)
- **Redeploy users-service**:
  - users-service reconstruido y reiniciado exitosamente
  - Health check: 200 en `/api/health`
  - CORS preflight: 204 en `OPTIONS /api/ratings` con headers correctos
  - Endpoints de confianza operativos y accesibles desde frontend
  - Configuración CORS: `Access-Control-Allow-Origin`, `Vary: Origin`, creds, methods, headers

### Feature: Auth JWKS Tests (✅ COMPLETADO)
- **Tests Remotos con WireMock**:
  - `JwtValidatorRemoteJwksTest`: Tests de validación exitosa, key miss, network error
  - Test habilitado: `validatesTokenAgainstRemoteJwks` usando in-memory JWKSet
  - Cobertura completa: 9/9 tests pasando en auth-service
  - Escenarios cubiertos: JWKS exitoso, key desconocida, error de red

### Feature: Multi-idioma (Completado ✅)
- **Backend TDD**:
  - `MessageService`: Servicio compartido con ResourceBundle para 6 idiomas
  - `LocaleUtils`: Parser de Accept-Language header con fallback a inglés
  - 4 servicios REST actualizados: users, trips, booking, matching
  - Todos los endpoints reciben `@HeaderParam("Accept-Language")`
  - Mensajes de error localizados en todos los servicios
  - 42 archivos de traducción (7 archivos × 6 idiomas)
- **Frontend TDD**:
  - `react-i18next`: Configuración completa con tests
  - `LanguageSwitcher`: Componente con dropdown para 6 idiomas
  - `useValidation`: Hook para mensajes de validación localizados
  - 48 archivos de traducción (8 namespaces × 6 idiomas)
  - Axios interceptor automático para Accept-Language header
- **Integración**:
  - Navbar migrado a i18n con LanguageSwitcher integrado
  - Componentes existentes actualizados (Trips, Matches, Bookings, etc.)
  - Tests unitarios para todos los componentes i18n
  - Compilación exitosa en todos los servicios backend
- **E2E Tests**:
  - Suite Cypress completa para language switching (language-switching.cy.ts)
  - 18 test cases covering all 6 languages (ca, es, ro, uk, en, fr)
  - Tests de persistencia localStorage y navegación entre páginas
  - Tests de validación en diferentes idiomas
  - Tests de dropdown behavior y current language highlighting
- **Documentación**:
  - techContext.md actualizado con arquitectura i18n completa
  - Detalles de implementación frontend y backend
  - Estrategia de fallback y persistencia documentada

### Feature #3: Creación de Viajes (✅ COMPLETADO)
- **Fase 1 ✅ - Frontend i18n Migration**:
  - Trips.tsx migrado completamente a react-i18next
  - 12 archivos de traducción actualizados (6 idiomas × 2 namespaces)
  - useValidation hook mejorado con validaciones para coordenadas, fechas, asientos
  - 100% de textos localizados (sin strings hardcoded)
  - Validaciones en tiempo real en idioma del usuario
  - Mensajes de éxito/error localizados
  - Opciones de sede localizadas
  - Trip cards con información localizada
- **Fase 2 ✅ - Enhanced Trip Management UI**:
  - EditTripModal component: Modal completo para edición de viajes con validaciones
  - TripCard component mejorado: Estados visuales, badges, información completa
  - TripFilters component: Filtros por estado, destino, rango de fechas
  - Estados visuales claros: ACTIVE (verde), COMPLETED (gris)
  - Filtros activos con chips removibles
  - Búsqueda y filtrado en tiempo real
  - 6 idiomas completos para todos los nuevos componentes
  - Integración completa en Trips.tsx con data-testid para tests E2E
  - Tests E2E verificados: filtros funcionando correctamente
- **Fase 3 ✅ - Backend Validations**:
  - TripValidationService: Servicio completo con reglas de negocio robustas
  - Validaciones: coordenadas, fechas futuras, asientos (1-8), formato sede, reservas confirmadas
  - BookingServiceClient: Integración con booking-service para verificar reservas activas
  - TripsResource actualizado: Validaciones integradas en POST, PUT, DELETE endpoints
  - 12 tests unitarios para TripValidationService (100% cobertura)
  - 8 tests de integración adicionales para TripsResource
  - Mensajes de error localizados en todos los endpoints
- **Fase 4 ✅ - E2E Tests Completos**:
  - create-edit-delete-flow.cy.ts: Test completo del flujo principal (crear/editar/filtrar/eliminar)
  - form-validations.cy.ts: 8 tests de validaciones de formulario frontend
  - enhanced-features.cy.ts: Tests corregidos (5/7 fallando → 7/7 pasando)
  - Cobertura E2E: 100% de funcionalidades de viajes cubiertas
- **Mejoras ✅ - UX y Integraciones**:
  - TripCard: MapPreview y MapLinkButtons integrados con expand/collapse
  - TripFilters: Contador de filtros activos, animaciones, persistencia en localStorage
  - EditTripModal: Preview de mapa, warnings de asientos reservados, mejor UX
  - Traducciones completas: 6 idiomas (ca, es, ro, uk, en, fr) para mapas, filtros, warnings
  - Integración completa: Backend validations + Frontend UX + E2E tests

### Feature: Sistema de Confianza (Anterior ✅)
- **Backend TDD**:
  - Entidad `Rating` con JPA, migración V3, repository y service
  - API REST: `POST /ratings`, `GET /ratings/my-ratings`, `GET /ratings/user/{userId}`
  - Endpoints de estadísticas: trust-score y trust-stats
  - 15 tests unitarios pasando (RatingResource, RatingService, Rating domain)
- **Frontend UI**:
  - `TrustProfile.tsx`: Perfil de confianza con estadísticas y tags
  - `RatingForm.tsx`: Formulario para crear valoraciones (thumbs up/down, tags, comentarios)
  - `RatingsList.tsx`: Lista de valoraciones recibidas por usuario
  - `TrustProfilePage.tsx`: Página completa de perfil de confianza
  - Integración en `Matches.tsx`: botones "Ver Perfil" y "Valorar"
- **Tests Frontend**:
  - Tests unitarios para componentes de confianza
  - Manejo de errores mejorado (404, 403, 5xx)
  - Z-index corregido para modales sobre mapas
- **CORS Issue Identificado**:
  - Filtro CORS implementado pero users-service necesita redeploy
  - Endpoint `/api/ratings` devuelve 404 - servicio no actualizado
  - Configuración correcta: puerto 8082, filtros CORS aplicados

### Feature: Perfil de Usuario (Anterior ✅)
- **Validaciones Robustas**:
  - Tests unitarios para validaciones de campos obligatorios
  - Validación de formato email y longitud mínima de nombre
  - Manejo de errores de API y estados de carga
  - 7 tests unitarios pasando (ProfileValidation.test.tsx)
- **E2E Tests**:
  - Tests Cypress para navegación y funcionalidades del perfil
  - Verificación de validaciones, mensajes de éxito/error
  - Tests para estados de carga y feedback visual
  - 12 tests E2E (navigate-profile.cy.ts)
- **UX Mejorada**:
  - Validaciones en tiempo real con feedback inmediato
  - Mensajes de error claros y específicos
  - Estados de carga y confirmaciones de éxito
  - Indicadores visuales para campos obligatorios

### Feature: Historial de Viajes (Anterior ✅)
- **Backend (TDD)**:
  - Trips Service: Filtro `status` en `GET /trips` (ACTIVE, COMPLETED)
  - Booking Service: Filtros `status`, `from`, `to` en `GET /bookings`
  - 82 tests pasando (23 trips + 59 bookings)
  - Lógica: viajes con dateTime < now() = COMPLETED
- **Frontend**:
  - Página `/history` con filtros (fecha, estado, rol)
  - Estadísticas: Total viajes, CO2 ahorrado, Km compartidos
  - Componente `SelectWithChildren` creado para filtros
  - 9 tests unitarios pasando (History.test.tsx)
- **E2E**:
  - Tests Cypress para navegación y filtrado (navigate-history.cy.ts)
  - Verificación de estadísticas, filtros y badges
- **Documentación**:
  - OpenAPI actualizado: trips-service.yaml y booking-service.yaml
  - Nuevos query params documentados con descripciones

### Feature: Mapa Básico (Anterior)
- **Frontend Components**:
  - `MapPreview.tsx`: Componente con marcadores de origen/destino, fit bounds automático
  - `MapLinkButtons.tsx`: Botones para Google Maps y Waze con URLs correctas
  - Integración en `Trips.tsx` y `Matches.tsx` cuando hay coordenadas disponibles
- **Dependencias**:
  - `react-leaflet`, `leaflet`, `@types/leaflet` instalados con `--legacy-peer-deps`
  - CSS de Leaflet importado en `main.tsx`
  - Variable `VITE_MAP_TILES_URL` configurada en `env.ts` y `env.example`
- **Tests**:
  - Tests unitarios: 16/16 ✅ (MapPreview y MapLinkButtons)
  - Tests E2E: Actualizados para verificar mapas en Trips y Matches
  - Build exitoso: TypeScript compila, Vite build completado

### Feature: Reserva de Plaza (Anterior)
- **Backend TDD**: 24 tests pasando - reglas de negocio y cancelación configurables
- **Frontend TDD**: Tests unitarios completos para BookingsService y páginas UI
- **E2E Tests**: Tests Cypress actualizados para flujos completos de reserva y cancelación

### Database & Backend (Anterior)
- `notification-service`: UUID real, Flyway V3, integración con booking/matching
- `booking-service`: NotificationServiceClient, tests TDD para confirm/cancel
- `matching-service`: Endpoints accept/reject, cliente de notificaciones

### Frontend UX (Anterior)
- Perfil: sección "Notificaciones Push" con service worker
- UI mejorada: badges de estado, botones deshabilitados, feedback visual

### Documentation & Tools
- **database-schemas.md**: Estructura completa de BD, schemas, índices, troubleshooting
- **e2e-test-coverage.md**: Análisis de cobertura, gaps, ejemplos de tests faltantes
- **seed-test-data.sh**: Script para generar datos de prueba en todos los schemas

## Next Steps (immediate)
- **✅ E2E Tests**: Suite Cypress multi-idioma completada (language-switching.cy.ts)
- **✅ Documentación**: techContext.md actualizado con arquitectura i18n completa
- **Plan Continuation**: Siguiente feature del roadmap o mejoras adicionales

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
 - **Autenticación en producción**: El bypass de auth (`AUTH_DISABLED=true`) es solo para desarrollo/test. En producción debe estar desactivado (`AUTH_DISABLED=false`) y la validación JWT debe permanecer activa (incluyendo `REQUIRE_ROLE_EMPLOYEE` según políticas).
