# Active Context

## Current Focus
- **Historial de viajes**: Backend completado con filtros TDD en trips-service y booking-service.
- **Backend**: Filtros status, from, to implementados en GET /trips y GET /bookings.
- **Tests**: 23 tests trips-service + 59 tests booking-service pasando (82/82 ✅).
- **Próximo**: Crear página frontend History.tsx con filtros y estadísticas.

## Feature Plan
- Ver `memory-bank/featurePlan.md` para el mapeo de las 15 funcionalidades (cobertura/estado/próximos pasos) y el roadmap por fases.

## Recent Changes (Octubre 10, 2025)

### Feature: Historial de Viajes (Backend Completado)
- **Trips Service**:
  - Filtro `status` añadido en `GET /trips` (ACTIVE, COMPLETED)
  - 4 tests unitarios nuevos (TripsHistoryFilterTest)
  - Todos los tests existentes actualizados y pasando (23/23 ✅)
- **Booking Service**:
  - Filtros `status`, `from`, `to` añadidos en `GET /bookings`
  - Soporte para CONFIRMED, PENDING, CANCELLED
  - 5 tests unitarios nuevos (BookingHistoryFilterTest)
  - Todos los tests existentes actualizados y pasando (59/59 ✅)
- **TDD Approach**:
  - Tests primero (Red), implementación después (Green)
  - Filtros combinables: status + date range
  - Lógica: viajes con dateTime < now() = COMPLETED

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
- **Frontend**: Crear página History.tsx con filtros y estadísticas
- **Tests**: Tests unitarios para History.tsx y E2E para navegación
- **Documentación**: Actualizar OpenAPI y Memory Bank tras completar frontend

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
- **Scripts interactivos**: `start-frontend.sh` ofrece levantar microservicios si no están corriendo.
- **Dual mode frontend**: Docker para producción-like, local (Vite) para desarrollo rápido con hot reload.
- **Verificación en capas**: `verify-infra.sh` para infraestructura base, `verify-all.sh` para sistema completo.
 - **Autenticación en producción**: El bypass de auth (`AUTH_DISABLED=true`) es solo para desarrollo/test. En producción debe estar desactivado (`AUTH_DISABLED=false`) y la validación JWT debe permanecer activa (incluyendo `REQUIRE_ROLE_EMPLOYEE` según políticas).
