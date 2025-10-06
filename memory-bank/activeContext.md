# Active Context

## Current Focus
- Implementación MVP por microservicios (Auth, Users, Trips, Booking, Matching completos).

## Recent Changes
- Auth: `JwtValidator` con Nimbus + tests en verde.
- Users: `/users/me` GET/PUT (DTO directo) + tests.
- Trips: `/trips` POST/GET (DTOs directos) + tests.
- Booking: `/bookings` POST/GET (DTO directo) + tests.
- Matching: `/matches` GET con mock + score simple + tests.
- Seguridad mínima: `AuthFilter` (Bearer) en users/trips/booking/matching.

## Next Steps
- Seeds/migraciones y repos en memoria/PG para usuarios y viajes.
- Alinear DTOs con OpenAPI y añadir verificación de contrato donde falte.
- Integraciones básicas entre servicios (matching usando trips seedados).

## Decisions & Considerations
- Tests de recursos devolviendo DTOs directamente para evitar `RuntimeDelegate`.
- Mantener OpenAPI como contrato guía; verificar campos clave en tests.
