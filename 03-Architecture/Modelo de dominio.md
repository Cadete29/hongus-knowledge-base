# Modelo de dominio

Arquitectura v1. Modelo lógico propuesto; no es un esquema SQL ejecutado. Cada entidad tiene ID estable y fechas; transiciones sensibles incluyen actor, motivo y versión. Nombres finales por acordar con los líderes.

## Entidades y relaciones
| Propietario    | Entidades y relaciones principales                                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identidad      | account 1:N session; account N:M platform_permission mediante concesión interna. selected_user_type no concede privilegios                               |
| Talento        | account 1:1 talent_profile; account 1:N student_review, cada revisión enlaza evidencia privada y resolución                                              |
| Organizaciones | organization 1:N membership; account 1:N membership con rol y estado; organization 1:N organization_review                                               |
| Oportunidades  | organization 1:N opportunity; opportunity 1:N revision y green_review                                                                                    |
| Candidaturas   | account 1:N application; opportunity 1:N application; application 1:N transition y una versión enviada de CV/perfil                                      |
| Suscripciones  | plan 1:N plan_version; account 1:N subscription_period; periodo enlaza versión del plan, pago y benefit_bucket                                           |
| Pagos          | account 1:N payment_order; order 1:N payment_attempt; payment 1:N refund y allocation_entry; provider_event registra deduplicación                       |
| Mentorías      | account 1:1 mentor_profile; mentor 1:N availability_slot; booking enlaza mentor, talento, intervalo, cupo incluido u orden extra; booking 1:N transición |
| CV y recursos  | account 1:N cv_version y ai_job; resource tiene publicación y elegibilidad por plan                                                                      |
| Verify         | achievement enlaza actividad, titular y responsable; achievement 1:N confirmation y credential_version                                                   |
| Relaciones     | contact_request une dos cuentas; inquiry une solicitante, organización, asunto y participantes autorizados; inquiry 1:N message                          |
| Operación      | complaint enlaza recurso y solicitante; audit_event registra cambios; outbox_event y job mantienen trabajo recuperable                                   |

## Claves y restricciones
- Identidad: correo normalizado único; claves secretas nunca en texto plano. Normalización definida sin asumir que todos los proveedores ignoran puntos o sufijos.
- Membresía: combinación cuenta-organización única con estado; revocación elimina permiso inmediatamente.
- Candidatura: propuesta de una candidatura por persona y oportunidad. Cambiar a reenvíos requiere regla de negocio explícita. Conservar snapshot al enviar; editar CV posteriormente no modifica lo enviado.
- Pago: moneda MXN, importes enteros en centavos, referencias externas únicas por proveedor y ambiente. Eventos únicos por proveedor y event_id.
- Activación: referencia de pago única por periodo activado; solo un periodo de plan de talento efectivo por cuenta al mismo tiempo. Cambios de plan y prorrateos pendientes.
- Cupo: libro de movimientos y saldo controlado en transacción; no permitir reservas incluidas por encima del cupo. No sustituir por contar documentos emitidos.
- Reserva: impedir solapamiento de intervalos activos tanto del mentor como del participante. Guardar inicio/fin y zona de presentación; una restricción por ID de slot no basta si existen slots superpuestos.
- Credencial: identificador público no secuencial, estado de validación y referencia a versión anterior; la URL no expone archivos académicos.
- Auditoría y reparto: corregir con entrada compensatoria, no borrar silenciosamente una transacción financiera ni una revocación.

## Estados propuestos
| Objeto | Ciclo |
| --- | --- |
| Cuenta | correo pendiente → habilitada; restringida/cerrada según proceso autorizado |
| Acreditación | borrador → pendiente → aprobada / requiere corrección / rechazada; aprobada → vencida según política |
| Oportunidad | borrador → revisión → publicada → cerrada; retirada con motivo; revisión nueva para cambios sustanciales |
| Candidatura | enviada → revisión → entrevista → seleccionada / no seleccionada; retirada por titular; contratación se confirma aparte |
| Pago | creada → pendiente → confirmada / fallida / cancelada; eventos inconsistentes → conciliación |
| Periodo | activación pendiente → activo → vencido; devoluciones y suspensión tienen política explícita |
| Reserva | retenida → confirmada → realizada / cancelada / inasistencia; retención vence si no se confirma |
| Logro | pendiente de confirmación → confirmado → documento emitido; corregido o revocado con motivo |
| Tarea | pendiente → ejecutando → terminada / reintento / intervención |

No tratar selección como contratación, asistencia como culminación exitosa ni fecha de pago como prueba de estudios. No modelar candidatura externa: el proceso será interno.

## Tiempo y dinero
Guardar instantes en UTC y zona IANA para horarios; calcular ciclos con una regla aprobada de calendario, incluyendo fin de mes. No asumir que un mes equivale a 30 días. La revisión periódica académica y el mes gratuito requieren definición antes de implementar vencimientos.

Ingresos propios: 20% MICE-LO y 80% Hongus; extras: 25% MICE-LO y 75% mentor, sin otro 20%. Base, impuestos, comisiones y redondeo por acordar. Guardar base y porcentajes aplicados, importe y versión de regla para conciliación; no presentar una asignación calculada como transferencia ejecutada.

## Índices y consulta
Proponer índices por propietario/estado/fecha para candidaturas y revisiones; organización/estado/cierre para publicaciones; mentor/intervalo para agenda; estado/próximo intento para tareas. Paginación obligatoria en listas. Validar índices con consultas y volumen de pruebas, no añadir infraestructura de búsqueda por anticipación.

## Extensión propuesta para formación y certificaciones
Fuente: [[Oportunidades formacion y certificaciones]]. Modelo técnico pendiente de validación.

- Mantener organization como propietaria de ofertas, incluida Hongus; separar membresías publicadoras de administración de plataforma.
- Distinguir convocatorias, proyectos, cursos y programas de certificación mediante tipo de oferta. Una convocatoria puede enlazar un programa sin duplicarlo.
- Modelar inscripción y progreso formativo aparte de application; reservar candidatura para selección.
- Separar programa de certificación, evaluación y credencial emitida. Enlazar emisor, participante, criterios y evidencia con achievement y credential_version cuando corresponda.
- Definir estados académicos y condiciones de emisión antes de implementar; pago, inscripción y asistencia no implican aprobación.

## Entidades ya representadas en PostgreSQL · 24 de septiembre de 2026

La implementación actual contiene cuentas, tokens de autenticación, sesiones, límites de frecuencia, bandeja de correo, secretos y retos MFA, consentimiento legal, órdenes de suscripción, suscripciones, acreditaciones académicas e incorporación pendiente. El tipo de cuenta y la intención de plan se guardan por separado: elegir un tipo o plan no concede por sí mismo permisos verificados ni beneficios pagados. Ver [[Estado actual del desarrollo]] y [[proyecto/AUTH_FLOW|Flujo técnico de autenticación]].
