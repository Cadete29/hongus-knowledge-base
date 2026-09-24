# Contratos y procesos críticos

Arquitectura v1. Contratos REST propuestos bajo /api/v1; no endpoints implementados. Entradas y salidas se documentarán en OpenAPI antes de cada ticket. Errores estables con código, mensaje seguro e ID de correlación. Validación, paginación y permisos en servidor.

## Contratos mínimos
| Área | Operaciones candidatas | Invariante |
| --- | --- | --- |
| Acceso | POST /accounts, /email-confirmations, /sessions; DELETE /sessions/current | Tipo público válido y correo; no permite admin |
| Incorporación | GET /me/onboarding; POST /me/student-reviews | Progreso propio; archivos privados |
| Revisión | POST /admin/student-reviews/{id}/decisions | Permiso, versión esperada y motivo |
| Planes | GET /plans; POST /me/payment-orders; GET /me/payment-orders/{id} | Precio del servidor, idempotencia y elegibilidad |
| Pago externo | POST /integrations/payments/{provider}/events | Firma, referencia, ambiente, importe, moneda y deduplicación |
| Oportunidades | GET /opportunities; POST /organizations/{id}/opportunities | Filtros de acceso y membresía vigente |
| Candidaturas | POST /opportunities/{id}/applications; GET /me/applications; POST /applications/{id}/transitions | Requisitos, cupo, snapshot y permiso sobre organización |
| Mentoría | GET /mentors/{id}/availability; POST /me/bookings; POST /bookings/{id}/cancellations | Sin solapamientos, cupo o pago válido |
| Verify | POST /achievements/{id}/confirmations; GET /me/credentials | Responsable autorizado y emisión solo tras confirmar |
| CV | POST /me/cv-jobs; GET /me/cv-jobs/{id}; GET /me/cv-versions | Plan, límites técnicos y revisión humana |
| Relaciones | POST /contact-requests; POST /organizations/{id}/inquiries; POST /inquiries/{id}/messages | Participantes autorizados; no chat general con organización |

## Registro y activación
Elegir tipo → crear cuenta → correo → gratuito → acreditación si Estudiante → revisión manual → plan y pago → beneficios. Inicio Profesional omite acreditación. Mentor y organización pasan a su revisión propia. Detalle y pantallas en [[Registro validacion y activacion]].

## Confirmación de pago
1. Crear orden idempotente con precio y versión del plan en servidor y elegibilidad vigente.
2. Abrir checkout externo. El retorno del navegador solo consulta estado.
3. Autenticar evento, guardar ID externo único y validar referencia, importe, MXN y ambiente. Eventos fuera de orden no degradan un pago ya confirmado.
4. En transacción corta, registrar confirmación, periodo, cupos, reparto pendiente de transferencia y evento outbox. Restricciones únicas evitan activación repetida.
5. Worker notifica. Si falla el correo, no se revierte el periodo. Si falla la transacción, reintentar desde evento persistido; nunca cobrar otra vez para activar.
6. Conciliar periódicamente pendientes con proveedor. Devolución se registra por ID externo único y entradas compensatorias; efectos sobre beneficios requieren política aprobada.

Proveedor aún por elegir; reglas de renovación, comisiones, impuestos, cambios de plan y reembolsos bloquean cobro real, no el modelado con adaptadores simulados.

## Reserva y cupos
Usar transacción y restricción de solapamiento de intervalos activos. Bloquear saldo de beneficio al reservar y registrar movimiento; una segunda petición no consume dos veces. No mantener la transacción abierta mientras se habla con un proveedor.

Extra: retener horario por plazo configurable, crear orden y confirmar después de pago. Si el pago llega cuando el horario ya fue liberado, conciliar y ofrecer solución conforme a política; no sobreasignar al mentor. Cancelación devuelve cupo o inicia devolución solo una vez según política. No acumular sesiones ordinarias después del ciclo.

## Candidatura y Verify
Enviar candidatura exige oportunidad abierta y derecho vigente; comprobar fecha en servidor dentro de operación consistente. Guardar versión enviada del perfil/CV. Cierre concurrente no debe permitir envío posterior por una pantalla desactualizada.

Terminación de actividad genera solicitud de logro. Responsable válido confirma evidencia; luego outbox solicita documento. Worker produce una versión con identificador estable e integridad del archivo; no emitir dos documentos equivalentes por reintento. Corrección conserva relación con documento sustituido y revocación mantiene estado visible. Ni pagar ni postularse acredita experiencia.

## IA y tareas durables
CV se genera desde datos consentidos del titular, sin documentos académicos ni notas privadas por defecto. El resultado es borrador, con revisión del titular antes de usarlo en candidatura. No inventar fechas, empleo o acreditaciones. Proveedor intercambiable mediante adaptador con límites, timeout y métricas de costo.

Outbox en la misma transacción que el cambio de negocio; worker toma trabajo con lease, reintento y espera creciente, máximo de intentos e intervención manual. Entrega al menos una vez: cada consumidor deduplica por ID de evento y operación. Separar cola de IA de correos críticos por prioridad para evitar bloqueo. Cancelar o reconciliar trabajos atascados. No afirmar entrega exactamente una vez.

Los planes mantienen uso ilimitado acordado: controles de concurrencia y protección frente a abuso no introducen cuotas comerciales ocultas. Si los costos exigen cambiar beneficios, elevarlo a decisión de producto antes de publicar.


## Contratos implementados y pendientes · 24 de septiembre de 2026

Ya existen contratos HTTP para registro, finalización de incorporación, confirmación y reenvío de correo, sesiones, recuperación de contraseña, MFA, consulta de incorporación y suscripciones. La confirmación de correo exige un token válido recibido por enlace; la interfaz no puede autoconfirmar. Las órdenes actuales permiten validar el modelo y la idempotencia, pero la autenticidad del pago real depende del futuro proveedor y su webhook. Ver [[Estado actual del desarrollo]] y los tickets HON-5 a HON-10 en [[Sistema de tickets en Linear]].
