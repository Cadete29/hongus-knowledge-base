from pathlib import Path
root=Path(__file__).resolve().parents[2]
notes={
'03-Architecture/Arquitectura de Hongus.md':'''# Arquitectura de Hongus

Versión: 1. Estado: propuesta técnica lista para revisión de los líderes. Se diseña a petición del fundador; no equivale a aprobación de proveedores ni implementación. Las reglas confirmadas de producto prevalecen sobre esta propuesta.

## Objetivo
Construir una plataforma web para México, desde 18 años, con apertura pública entre julio y octubre de 2027. Cumplir todos los beneficios de los planes antes de cobrarlos. Dos líderes supervisan y programan con colaboradores por reclutar; horarios flexibles, sin Scrum. Presupuesto inicial asignado $0; producción necesita costos y responsables definidos.

## Estructura elegida para la propuesta
**Monolito modular:** una API desplegable, con reglas separadas por módulo y una base PostgreSQL. Un proceso worker del mismo código ejecuta tareas durables. Una aplicación web muestra vistas distintas según permisos. No crear una aplicación independiente por cada tipo de usuario.

```text
Navegador: web pública y área autenticada por rol
                  | HTTPS, mismo origen preferido
                  v
           Entrada web / proxy
             |             |
       Archivos web     API /api/v1
                           |
        Servicios de módulos y autorización
             |             |              |
        PostgreSQL    Archivos privados   Adaptadores externos
             |                               pagos / correo / IA
       Tareas y outbox
             |
          Worker -----> generación CV y documentos / notificaciones
```

El panel administrativo es una vista protegida, no un registro público. Elegir tipo de usuario solo expresa intención; revisión y permisos conceden capacidades. Mentores y organizaciones siguen su incorporación propia, sin asignarles planes de talento automáticamente.

## Módulos y límites
| Módulo | Posee | Ofrece a los demás |
| --- | --- | --- |
| Identidad | Cuenta, sesión, permisos de plataforma | Identidad autenticada y autorización |
| Talento | Perfil, acreditación académica | Elegibilidad y datos autorizados del perfil |
| Organizaciones | Organización y membresías | Permiso vigente para actuar por una entidad |
| Oportunidades | Publicaciones, requisitos, revisión verde | Disponibilidad y requisitos para candidaturas |
| Candidaturas | Envíos, versiones y transiciones | Seguimiento y resultados confirmados |
| Suscripciones | Plan versionado, periodo, derechos y cupos | Derecho vigente para cada acción |
| Pagos | Órdenes, transacciones, devoluciones y reparto | Confirmación conciliada, sin conceder roles |
| Mentorías | Agenda, reservas, sesiones y asistencia | Consumo o devolución de cupo según política |
| CV y recursos | CV, versiones, guías y solicitudes IA | Borradores revisables por su titular |
| Verify | Logros, confirmantes y documentos versionados | Evidencia verificable con exposición limitada |
| Relaciones | Contactos, asuntos, participantes y mensajes | Intercambio autorizado por propósito |
| Operación | Reclamaciones, auditoría y tareas | Soporte, notificaciones y acciones trazables |

Los módulos no escriben directamente tablas de otros módulos; usan servicios públicos internos. Lecturas cruzadas para reportes requieren consultas autorizadas o proyecciones explícitas. Compartir una base facilita transacciones, no elimina límites. Validar entradas en servidor y probar reglas sin depender de la interfaz.

## Stack propuesto
| Capa | Propuesta | Motivo y límite |
| --- | --- | --- |
| Web autenticada | React con Vite, JavaScript y CSS Modules | Continuidad con mice.2; routing, datos remotos y accesibilidad se diseñan explícitamente |
| Web pública | Misma base visual, páginas de presentación prerenderizadas cuando sea necesario | Descubrimiento público y metadatos requieren estrategia propia; una SPA no resuelve SEO por sí sola |
| API y worker | Node.js LTS con Express, JavaScript | Experiencia observada; elegir una línea soportada al implementar y reevaluar antes de 2027 |
| Base | PostgreSQL y migraciones SQL versionadas; acceso parametrizado | Integridad de pagos, periodos y reservas; sin elegir ORM obligatorio |
| Archivos | Almacenamiento de objetos privado, proveedor por definir | Evidencias y PDFs fuera del directorio público y de la base |
| Pruebas | Pruebas de reglas, integración con PostgreSQL y Playwright para recorridos | Reutilizar prácticas del equipo; pruebas de API simulada no sustituyen integración real |
| Entrega | GitHub Actions propuesto y despliegue controlado | Revisión por otra persona; no crea repositorios ni workflows en esta fase |

No fijar versiones futuras ni asumir servicios gratuitos suficientes. TypeScript puede evaluarse con los líderes, pero no se presupone experiencia ni se agrega como requisito inicial. Redis, microservicios, Kubernetes, matching avanzado y app móvil nativa quedan fuera de esta v1; reconsiderar solo por necesidad medida.

## Organización propuesta del repositorio de aplicación
La bóveda actual continúa siendo documentación. No se crea aún el repositorio de código.
```text
apps/web/src/features/         pantallas por capacidad
apps/api/src/modules/         rutas, servicios y persistencia por módulo
apps/worker/                  ejecución de tareas con servicios compartidos
packages/contracts/           esquemas de entrada/salida sin secretos
packages/domain/              reglas reutilizadas por API y worker
db/migrations/                cambios incrementales de esquema
tests/integration/            base real de pruebas y adaptadores
tests/e2e/                    recorridos completos
ops/                          despliegue y recuperación
```
Evitar duplicar reglas entre API y worker o confiar en validaciones compartidas del cliente como autorización. El árbol es una convención propuesta, no código existente.

## Documentos de implementación
- [[Modelo de dominio]]: entidades, relaciones, estados e invariantes.
- [[Seguridad y confianza]]: matriz de acceso y evidencias privadas.
- [[Contratos y procesos criticos]]: API, pagos, reservas, Verify e IA.
- [[Operacion y entornos]]: despliegue, pruebas, incidentes y costos.
- [[Decisiones tecnicas y evolucion]]: elección, alternativas y cambios futuros.
- [[Registro validacion y activacion]]: primer recorrido de producto.

## Fundamento técnico consultado
React documenta que iniciar desde una herramienta como Vite requiere resolver routing, datos y otras necesidades; la propuesta adopta ese costo por continuidad del equipo: [React](https://react.dev/learn/build-a-react-app-from-scratch).
Producción debe usar una línea Node.js Active LTS o Maintenance LTS: [Node.js](https://nodejs.org/en/about/previous-releases).
PostgreSQL documenta bloqueo de filas para coordinar actualizaciones concurrentes: [PostgreSQL](https://www.postgresql.org/docs/18/explicit-locking.html). Las transacciones se mantendrán breves, sin llamadas externas dentro del bloqueo.
''',
'03-Architecture/Modelo de dominio.md':'''# Modelo de dominio

Arquitectura v1. Modelo lógico propuesto; no es un esquema SQL ejecutado. Cada entidad tiene ID estable y fechas; transiciones sensibles incluyen actor, motivo y versión. Nombres finales por acordar con los líderes.

## Entidades y relaciones
| Propietario | Entidades y relaciones principales |
| --- | --- |
| Identidad | account 1:N session; account N:M platform_permission mediante concesión interna. selected_user_type no concede privilegios |
| Talento | account 1:1 talent_profile; account 1:N student_review, cada revisión enlaza evidencia privada y resolución |
| Organizaciones | organization 1:N membership; account 1:N membership con rol y estado; organization 1:N organization_review |
| Oportunidades | organization 1:N opportunity; opportunity 1:N revision y green_review |
| Candidaturas | account 1:N application; opportunity 1:N application; application 1:N transition y una versión enviada de CV/perfil |
| Suscripciones | plan 1:N plan_version; account 1:N subscription_period; periodo enlaza versión del plan, pago y benefit_bucket |
| Pagos | account 1:N payment_order; order 1:N payment_attempt; payment 1:N refund y allocation_entry; provider_event registra deduplicación |
| Mentorías | account 1:1 mentor_profile; mentor 1:N availability_slot; booking enlaza mentor, talento, intervalo, cupo incluido u orden extra; booking 1:N transición |
| CV y recursos | account 1:N cv_version y ai_job; resource tiene publicación y elegibilidad por plan |
| Verify | achievement enlaza actividad, titular y responsable; achievement 1:N confirmation y credential_version |
| Relaciones | contact_request une dos cuentas; inquiry une solicitante, organización, asunto y participantes autorizados; inquiry 1:N message |
| Operación | complaint enlaza recurso y solicitante; audit_event registra cambios; outbox_event y job mantienen trabajo recuperable |

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
''',
'04-Security/Seguridad y confianza.md':'''# Seguridad y confianza

Arquitectura v1: controles propuestos para implementar y probar. No constituye una auditoría de seguridad realizada.

## Autorización
Primero autenticar; después comprobar permiso de función, propiedad o membresía vigente y derecho del plan. Estos controles ocurren en servidor en cada consulta y modificación. Ocultar un botón no protege el recurso. selected_user_type del registro nunca acepta admin ni concede permisos.

| Recurso | Titular | Organización | Mentor | Operación autorizada |
| --- | --- | --- | --- | --- |
| Perfil visible | Decide campos compartidos según plan | Lee campos publicados o candidatura autorizada | Lee lo publicado o compartido para sesión | Soporte limitado |
| Evidencia académica | Su envío y estado | Sin acceso | Sin acceso | Solo revisor académico autorizado |
| Publicación | Lectura según acceso; gratis solo empleos | Edita propias con permiso; no se autoaprueba | Lectura según reglas de su incorporación | Revisión y retirada con motivo |
| Candidatura | Crea y consulta propia | Solo las de su organización, permiso de reclutamiento | Sin acceso por defecto | Soporte mínimo auditado |
| Reserva | Sus sesiones | Sin acceso | Sesiones asignadas | Coordinación limitada |
| Notas privadas | Según autoría y acuerdo | Sin acceso | Sus notas | Sin acceso rutinario |
| Pago | Su resumen | Sin acceso por ser organización | Solo su liquidación de extras | Conciliador financiero |
| Asunto | Participante autorizado | Miembros autorizados de la organización destinataria | Solo si es participante permitido | Moderación por incidencia |
| Documento Verify | Sus documentos | Confirma solo actividad a su cargo | Confirma solo actividad a su cargo | Corrector autorizado |

El nivel de acceso al catálogo para mentor y organización sigue pendiente; no aplicarles por defecto la tabla de suscripciones de talento. Una universidad no recibe acceso a toda la información de sus estudiantes.

## Sesiones y archivos
Propuesta para web inicial: sesión opaca en cookie HttpOnly, Secure y SameSite, con expiración y revocación en servidor; protección CSRF y comprobación de origen en modificaciones. Evitar tokens duraderos en almacenamiento accesible a JavaScript. Recuperación con tokens de un uso y contraseñas con algoritmo especializado. MFA propuesto para personal con acceso sensible; modalidad por seleccionar.

Archivos en almacenamiento privado, validación de formato y contenido, límites explícitos y cuarentena antes de disponibilidad. URLs firmadas de corta vida solo después de autorizar; no registrar URL firmada ni documento en logs. Descargar como adjunto cuando corresponda y limitar ejecución de contenido activo. Retención y borrado pendientes antes de recopilar evidencia real.

## Acciones sensibles
Concesión de permisos administrativos solo por proceso interno, nunca autoasignación. Evitar autoaprobar acreditación o actividad propia. Revocaciones, cambios de importe, devoluciones y permisos registran actor y motivo; segunda revisión propuesta para acciones financieras excepcionales. Definir quién sustituye al responsable ausente.

Consulta pública de Verify: propuesta de token no adivinable que muestra solo tipo, emisor, estado y datos mínimos autorizados; no indexar documentos privados ni permitir enumeración de titulares. Alcance de exposición por aprobar.

## Pruebas requeridas
Acceso entre dos cuentas y dos organizaciones; revocación de membresía; tipo admin enviado manualmente; archivos ajenos; fraude en precio/moneda; CSRF; enlace expirado; límites de carga; doble confirmación; falta de permiso de mentor. Secretos fuera del repositorio; registros redactados y acceso a producción individualizado.

Ver [[Contratos y procesos criticos]] y [[Operacion y entornos]].
''',
'03-Architecture/Contratos y procesos criticos.md':'''# Contratos y procesos críticos

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
''',
'07-DevOps/Operacion y entornos.md':'''# Operación y entornos

Arquitectura v1, propuesta. Ventana de apertura: 1 de julio al 1 de octubre de 2027. Trabajo flexible sin Scrum; asignar propietarios y sustitutos de incidentes antes de abrir.

## Entornos y despliegue
Desarrollo local con datos ficticios y adaptadores simulados. Pruebas con base y almacenamiento separados, correos controlados y pagos de sandbox. Producción con secretos y datos independientes. Nunca reutilizar credenciales de producción en pruebas.

Topología inicial propuesta: web estática en servicio de archivos/CDN o proxy; API y worker en entorno de aplicación; PostgreSQL persistente y objetos privados. API y worker pueden compartir alojamiento inicial si carga y presupuesto lo permiten, con límites de recursos y procesos separados. Fallo de ese alojamiento afecta ambos: documentarlo y probar recuperación. No elegir proveedor o prometer costo cero todavía.

Publicación: revisión de otro líder → pruebas → build reproducible con dependencias fijadas → migración compatible → despliegue → prueba de salud y recorrido crítico. Separar permiso de desplegar de permiso de revisar acreditaciones. Hacer migraciones incrementales: añadir, migrar y después retirar; no borrar columnas usadas por una versión anterior durante rollback.

## Verificación antes de cobro público
- Reglas unitarias de elegibilidad, cupos y reparto; integración con PostgreSQL real para bloqueos, claves únicas y rollback.
- Recorridos de los cinco tipos, incluyendo solicitud de tipo admin rechazada.
- Webhooks duplicados, tardíos y fuera de orden; fallos de worker y recuperación.
- Dos reservas simultáneas; exposición entre organizaciones y archivos privados.
- Perfil, CV, guías, consultas, mentoría y Verify disponibles según plan, no solo checkout.
- Restaurar base y archivos en entorno aislado y reconciliar pagos con proveedor.

## Observabilidad e incidentes
Logs estructurados con correlación, sin contraseñas, tokens ni documentos. Métricas: latencia/errores API, edad de cola, activación pendiente tras pago, errores de generación, ocupación de agenda y gastos de IA. Alertas con destinatario y procedimiento; herramienta por elegir.

Incidente grave: contener acceso o detener nuevo cobro si no se puede activar, conservar evidencia, determinar alcance, restaurar o corregir y comunicar a afectados conforme al procedimiento aprobado. No exigir guardias permanentes implícitas a voluntarios; acordar cobertura y escalamiento antes de lanzamiento.

## Recuperación propuesta para presupuestar
Objetivos iniciales a validar, no SLA: RPO de 24 horas para información no financiera y RTO de 8 horas. Pagos requieren reconciliación contra proveedor y conservación de eventos; comprobar que el respaldo disponible permite reconstruir periodos y aportaciones. Si el objetivo resulta insuficiente, contratar respaldos incrementales o recuperación a un punto temporal antes de operar.

Respaldos de base y objetos fuera del mismo punto de fallo, cifrados y con acceso limitado. Prueba de restauración antes de abrir y después de cambios relevantes; periodicidad posterior por acordar. Retención de respaldos compatible con política de datos por definir.

## Capacidad y presupuesto
10,000 usuarios es aspiración de impacto, no estimación de concurrencia. Definir cuentas activas, sesiones simultáneas, cargas de archivos y generaciones por hora antes de dimensionar.

| Rubro | Variable para estimar | Responsable propuesto |
| --- | --- | --- |
| API y worker | CPU, memoria, tráfico y carga de tareas | Liderazgo técnico |
| PostgreSQL | Tamaño, conexiones y respaldos | Liderazgo técnico |
| Archivos | GB guardados, descarga y retención | Técnico y administración |
| Correo | Mensajes transaccionales y entregabilidad | Técnico y operación |
| IA | Solicitudes, tamaño de entrada/salida y reintentos | Producto y técnico |
| Cobros | Comisiones, devoluciones y liquidaciones | Responsable financiero por designar |
| Mentoría | Estudiantes de pago × 1 + profesionales de pago × 4 sesiones | Coordinación de mentores |

Registrar gasto esperado, límite de autorización y aviso antes de contratar. Presupuesto inicial $0 no compromete gratuidad futura. Si oferta de sesiones no alcanza, resolver capacidad antes de vender el beneficio.
''',
'03-Architecture/Decisiones tecnicas y evolucion.md':'''# Decisiones técnicas y evolución

Arquitectura v1 propuesta. Las filas son recomendaciones explícitas del diseño, no aprobaciones del fundador ni compras autorizadas.

| ID | Propuesta | Motivo | Alternativa o disparador de cambio |
| --- | --- | --- | --- |
| ARQ-01 | Monolito modular y worker compartiendo reglas | Dos líderes, presupuesto por gasto, transacciones comunes | Separar servicio solo si hay carga, aislamiento o propiedad de equipo que lo justifique |
| ARQ-02 | React/Vite y Node/Express | Evidencia de experiencia en mice.2 y CV | Evaluar framework con renderizado si SEO público lo requiere |
| ARQ-03 | PostgreSQL y objetos privados | Integridad relacional y archivos con controles diferentes | Escalar conexiones/índices antes de cambiar motor |
| ARQ-04 | Outbox y tareas persistentes en PostgreSQL | Evitar pérdida de tareas sin añadir broker al inicio | Broker si métricas muestran contención o requerimientos no cubiertos |
| ARQ-05 | Sesión web en cookie protegida | Control de revocación y alcance de cliente inicial | Diseñar flujo específico para móvil cuando exista; no trasladar tokens sin análisis |
| ARQ-06 | Adaptadores para pagos, correo e IA | Proveedores no elegidos; pruebas sin cobros | Cambiar proveedor preservando estados e idempotencia |
| ARQ-07 | Roles, propiedad y derechos de plan independientes | Tipo de usuario no equivale a autorización o suscripción | Nuevos roles requieren pruebas de matriz de permisos |

## Qué permanece pendiente
Renovación manual/automática, ciclo gratuito, vencimiento académico, comisiones e impuestos, cambios de plan, cancelaciones, conservación documental, método de edad y nombre del segundo líder. Proveedores, versiones, costos, concurrencia y responsables operativos antes de producción. RPO/RTO son objetivos propuestos por validar.

## Cómo incorporar ideas
1. Registrar problema, usuario beneficiado y resultado esperado en un ticket.
2. Líderes identifican módulos, datos, permisos, integraciones y costos afectados.
3. Dirección prioriza ahora o después; cambios de planes o compromisos requieren aprobación explícita.
4. Actualizar contrato, modelo y decisiones vigentes antes de implementar.
5. Entregar cambio compatible y migración probada; documentar reversión o recuperación.

No usar el cambio continuo para alterar pagos, documentos o datos previos sin trazabilidad. Conservar historial operativo exigido por las funciones, aunque se hayan eliminado borradores antiguos de marca. Trabajo asíncrono por tickets, sin sprints ni Scrum.

## Implementación incremental
Primero [[Tickets de registro y activacion]]: modelo y prototipo en paralelo, cuentas, evidencia, revisión y pago simulado. Después candidaturas y organizaciones; reservas; CV/Verify; recursos/contactos; conciliación y operación. Integración de cobros real solo tras políticas y beneficios completos.

Responsabilidades propuestas: Janice, interfaz y validación funcional; segundo líder, API/datos/integraciones; ambos, revisión cruzada. Asignación definitiva y disponibilidad pendientes, sin atribuir experiencia no demostrada.

## Criterios para aceptar esta arquitectura
Los líderes pueden explicar cada módulo y sus dependencias; el recorrido aprobado cabe sin excepciones improvisadas; estados distinguen cuenta, estudios y plan; permisos protegen evidencia; duplicados y concurrencia tienen resolución; costos y operación tienen pendientes visibles. Aceptarla no significa que ya esté desplegada o auditada.
'''
}
for name,content in notes.items():
 (root/name).write_text(content.strip()+'\n',encoding='utf-8')
p=root/'Home.md';s=p.read_text(encoding='utf-8');s+='\n## Arquitectura v1\n[[Arquitectura de Hongus]] · [[Modelo de dominio]] · [[Contratos y procesos criticos]] · [[Seguridad y confianza]] · [[Operacion y entornos]] · [[Decisiones tecnicas y evolucion]]\n';p.write_text(s,encoding='utf-8')
p=root/'03-Architecture/Decisiones.md';s=p.read_text(encoding='utf-8');s+='\n## Arquitectura v1 preparada\nA petición del fundador se documentó la propuesta completa en [[Arquitectura de Hongus]] y [[Decisiones tecnicas y evolucion]]. No hay proveedores contratados, stack aprobado ni aplicación implementada por esta documentación.\n';p.write_text(s,encoding='utf-8')
p=root/'Backlog.md';s=p.read_text(encoding='utf-8');s+='\n## Arquitectura\n- [x] Crear [[Arquitectura de Hongus]] v1 con modelo, permisos, contratos y operación.\n- [ ] Revisar [[Decisiones tecnicas y evolucion]] con los líderes y aceptar o ajustar.\n- [ ] Resolver políticas pendientes y presupuesto antes de activar producción.\n';p.write_text(s,encoding='utf-8')
# Check local note references in all architecture outputs.
import re
names={p.stem for p in root.rglob('*.md') if '.git' not in p.parts}
missing=[]
for name in notes:
 for link in re.findall(r'\[\[([^\]|]+)',(root/name).read_text(encoding='utf-8')):
  if link not in names:missing.append((name,link))
assert not missing,missing
print(f'{len(notes)} notas de arquitectura creadas o actualizadas; enlaces internos verificados. Home, decisiones y backlog enlazados.')
