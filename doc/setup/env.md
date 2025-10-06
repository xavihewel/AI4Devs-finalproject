# Variables de entorno (plantillas)

## Backend (Java 17/Jakarta)
```
# Database
DB_URL=jdbc:postgresql://localhost:5432/app
DB_USERNAME=app
DB_PASSWORD=app

# OIDC / Keycloak
OIDC_ISSUER_URI=http://localhost:8080/realms/covoituraje-dev
OIDC_JWKS_URI=http://localhost:8080/realms/covoituraje-dev/protocol/openid-connect/certs
OIDC_CLIENT_ID=backend-api
OIDC_CLIENT_SECRET=change-me

# Redis
REDIS_URL=redis://localhost:6379
```

## Frontend (React/TypeScript)
```
# OIDC / Keycloak
VITE_OIDC_AUTHORITY=http://localhost:8080/realms/covoituraje-dev
VITE_OIDC_CLIENT_ID=frontend-spa
VITE_OIDC_REDIRECT_URI=http://localhost:5173/

# API base URLs
VITE_API_USERS=http://localhost:8081
VITE_API_TRIPS=http://localhost:8082
VITE_API_BOOKINGS=http://localhost:8083
VITE_API_MATCHING=http://localhost:8084
```

Nota: crea archivos `.env` locales en `Backend/` y `Frontend/` con estos valores. No se versionan.
