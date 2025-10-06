# Entorno local de desarrollo

## Requisitos
- Docker y Docker Compose
- Java 17 (para Backend), Node 18+ (para Frontend)

## Servicios (docker-compose)
- PostgreSQL + PostGIS: puerto 5432 (user/pass/db: app/app/app)
- Redis: puerto 6379
- Keycloak: puerto 8080 (admin/admin)
- Mailhog (opcional): UI 8025, SMTP 1025

## Pasos
1) Arrancar infraestructura
```bash
docker compose up -d
```
2) Verificar servicios
- DB: psql postgres://app:app@localhost:5432/app
- Keycloak: http://localhost:8080 → admin/admin
- Mailhog: http://localhost:8025 (opcional)

3) Backend (Java 17 + Jakarta)
- Estructura DDD por microservicio en `Backend/`
- Configurar OIDC (Keycloak) y datasource (PostgreSQL)
- Ejecutar tests con Maven (JUnit5/Mockito)

4) Frontend (React/TS)
- Configurar OIDC client y endpoints `/users`, `/trips`, `/bookings`, `/matches`

## Notas
- Variables de entorno: crea un `.env` local si es necesario.
- Seguridad/privacidad: usa zona aproximada, no dirección exacta.
