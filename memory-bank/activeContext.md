# Active Context

## Current Focus
- **Backend**: Migrado a WAR + Payara Micro (JDK17) en `trips`, `users`, `booking`, `matching`; todos con `@ApplicationPath("/api")` y `HealthResource`. `persistence.xml` en `RESOURCE_LOCAL`; `hbm2ddl=update` en `trips/booking/matching`.
- **Infra local**: `docker-compose.yml` con PostgreSQL (5434), Keycloak (8080), Mailhog (8025), microservicios: trips 8081, users 8082, booking 8083, matching 8084. `OIDC_ISSUER_URI` alineado a `http://localhost:8080/realms/covoituraje`.
- **Auth**: Filtro permite `/api/health` sin token en todos. JWT validado contra JWKS de Keycloak; `aud` incluye `backend-api` mediante mapper.
- **Frontend**: Base operativa; tests de integración de salud pasan; tests de flujos aún con 401/intermitencias en `/api/trips`.

## Recent Changes
- Migración Dockerfiles a Payara Micro (`payara/micro:6.2024.6-jdk17`) con despliegue `ROOT.war`.
- `persistence.xml`: `db:5432`, `RESOURCE_LOCAL`; `hbm2ddl=update` en servicios con errores de esquema.
- `AuthFilter`: excepción para `/api/health` en todos.
- Keycloak: cliente `backend-api` (bearer-only) y mapper de audiencia en `covoituraje-frontend`.

## Next Steps (immediate)
- **Estabilizar `/api/trips`**: revisar logs y consultas JPA; garantizar respuesta 200 (evitar timeouts). Considerar seeds mínimas.
- **Validación end-to-end**: Re-ejecutar tests FE (flows) tras estabilizar trips.
- **Observabilidad**: añadir logs/metrics básicos para diagnósticos.

## Decisions & Considerations
- **Ruta base común**: `/api` para todos; enrutamiento por path para distinguir servicios.
- **Salud sin auth**: `/api/health` permitido en todos los servicios.
- **Infra**: Puertos expuestos (8081-8084) para acceso local directo desde consola/Frontend.
