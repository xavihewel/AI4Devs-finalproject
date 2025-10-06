# Epics (MVP)

## Epic 1: Autenticación corporativa (OIDC con Keycloak)
- Objetivo: Acceso seguro SSO para empleados.
- Alcance: flujo OIDC, validación JWT, roles básicos.

## Epic 2: Gestión de usuarios y perfil mínimo
- Objetivo: Perfil con zona aproximada, sede y rol.
- Alcance: CRUD usuario, preferencias mínimas.

## Epic 3: Trips (publicación y búsqueda básica)
- Objetivo: Publicar y listar trayectos por sede/horario.
- Alcance: CRUD trayecto, filtros sencillos.

## Epic 4: Booking (reserva y confirmación)
- Objetivo: Reservar plazas y ver viajes confirmados.
- Alcance: flujo de reserva inmediata, estados básicos.

## Epic 5: Matching básico
- Objetivo: Sugerir coincidencias por sede + franja horaria.
- Alcance: endpoint `/matches`, score simple.

## Epic 6: Infra dev local
- Objetivo: Entorno reproducible.
- Alcance: docker-compose (PostgreSQL+PostGIS, Redis, Keycloak), migraciones, seeds.
