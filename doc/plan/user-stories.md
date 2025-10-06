# User Stories (MVP)

## US1: Login corporativo por SSO (OIDC)
Como empleado, quiero iniciar sesión con mi cuenta corporativa para acceder a la plataforma de forma segura.

Criterios de aceptación:
- Redirige a IdP (Keycloak) y vuelve con sesión iniciada.
- Tokens válidos y roles básicos.

## US2: Completar perfil mínimo
Como empleado, quiero completar mi perfil con zona aproximada, sede y rol para que el sistema pueda sugerirme viajes.

Criterios de aceptación:
- Zona aproximada (barrio/CP), sede y rol (conductor/pasajero).
- Privacidad: no se guarda dirección exacta.

## US3: Publicar trayecto (conductor)
Como conductor, quiero publicar un trayecto con fecha/hora, origen aprox., destino (sede) y plazas para ofrecer plazas a compañeros.

Criterios de aceptación:
- Formulario con campos mínimos; crear/editar/cancelar.

## US4: Buscar y reservar (pasajero)
Como pasajero, quiero buscar trayectos por sede y franja horaria y reservar una plaza para coordinar mi viaje.

Criterios de aceptación:
- Filtros sencillos; reserva inmediata si hay plaza; confirmación.

## US5: Ver viajes confirmados
Como usuario, quiero ver mis viajes confirmados para conocer detalles y participantes.

Criterios de aceptación:
- Lista de próximos viajes con rol del usuario.
