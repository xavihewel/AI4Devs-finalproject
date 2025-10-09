# Feature Plan

## Mapeo de 15 funcionalidades → Cobertura, estado y próximos pasos

| # | Funcionalidad | Cobertura en plan | Estado actual | Próximos pasos |
|---|----------------|-------------------|---------------|----------------|
| 1 | Registro e inicio de sesión corporativo (SSO) | Sí (OIDC/Keycloak) | Backend OIDC listo; FE login en validación | Re-ejecutar auth E2E tras fix CORS; ajustar FE si necesario |
| 2 | Perfil de usuario | Sí (Users Service) | API `GET/PUT /users/me` implementada | Completar UI perfil; validaciones y tests FE |
| 3 | Creación de viajes | Sí (Trips Service) | API trips con JPA | Completar UI crear/gestionar viajes; tests |
| 4 | Búsqueda y emparejamiento | Sí (Matching Service) | Matching básico | UI búsqueda + mostrar scoring; filtros básicos |
| 5 | Reserva de plaza | Sí (Booking Service) | API bookings con estados | UI reservar/cancelar; reglas autoaceptación básica |
| 6 | Notificaciones en tiempo real | Parcial (Notifications plan) | Hooks definidos; sin worker | Implementar worker simple email; preparar push later |
| 7 | Mapa y geolocalización básica | No explícito (implícito en UI futura) | No iniciado | Añadir en plan: mapa sencillo y enlaces a Maps/Waze |
| 8 | Historial de viajes | Parcial (Trips/Bookings list) | Listas base | Añadir filtros/estadísticas simples |
| 9 | Sistema de confianza interno | Plan (Ratings) | Modelo `Rating` definido | API/FE para thumbs y tags básicas |
| 10 | Privacidad avanzada | Sí (zona aprox., chat interno) | Zona aprox. en perfil | Añadir controles de visibilidad y chat interno later |
| 11 | Integración calendario corporativo | Plan (opcional) | No iniciado | Crear hook iCal/Outlook simple (descarga .ics) |
| 12 | Gamificación / incentivos | Plan (opcional) | No iniciado | Bocetar puntos/badges; métricas base |
| 13 | Compartición de costes | Plan (opcional) | No iniciado | Cálculo estimado y marcado “beneficio empresa” |
| 14 | Desplazamientos puntuales | Sí (Trips puntuales) | Soportado por Trips | UI específica “evento” con fecha/hora |
| 15 | Reportes RRHH / Sostenibilidad | Sí (Analytics plan) | Métricas base planificadas | Endpoint métricas agregadas + dashboard básico |

Notas:
- CORS backend corregido y `ALLOWED_ORIGINS` en compose; FE dev `.env.local` actualizado.
- Reejecutar suite de auth E2E para validar login y `/users/me`.

## Roadmap por fases (actualizado)

- MVP (esencial): 1, 2, 3, 4 (básico), 5, 6 (email simple), 14
- Fase 2 (importante): 7, 8, 9, 10, 15 (panel básico)
- Fase 3 (valor añadido): 11, 12, 13, 4 avanzado (scoring/ETA)

