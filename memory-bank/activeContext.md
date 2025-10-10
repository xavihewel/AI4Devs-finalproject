# Active Context

## Current Focus
- **Perfil de usuario**: Feature completado con mejoras de validaciones y UX.
- **Validaciones**: Tests robustos para campos obligatorios, formato email, longitud mínima.
- **E2E**: Tests Cypress para navegación, validaciones y funcionalidades del perfil.
- **Próximo**: Siguiente feature del plan (Notificaciones E2E o Sistema de confianza).

## Feature Plan
- Ver `memory-bank/featurePlan.md` para el mapeo de las 15 funcionalidades (cobertura/estado/próximos pasos) y el roadmap por fases.

## Recent Changes (Octubre 10, 2025)

### Feature: Perfil de Usuario (Mejorado ✅)
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
