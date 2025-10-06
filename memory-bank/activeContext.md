# Active Context

## Current Focus
- Implementación MVP por microservicios (Auth, Users, Trips, Booking; Matching en curso).

## Recent Changes
- Auth: `JwtValidator` con Nimbus + tests en verde.
- Users: `/users/me` GET/PUT (DTO directo) + tests.
- Trips: `/trips` POST/GET (DTOs directos) + tests.
- Booking: `/bookings` POST/GET (DTO directo) + tests.

## Next Steps
- Matching-service `/matches` GET (score básico) + tests.
- Integración básica entre servicios y validación JWT en endpoints.

## Decisions & Considerations
- Tests unitarios de recursos sin RuntimeDelegate (retornando DTOs directamente).
- Mantener OpenAPI como contrato guía; alinear DTOs si cambian.
