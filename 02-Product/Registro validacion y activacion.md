# Registro validación y activación

ID: REC-01. Estado: especificación propuesta para revisión. Fuente: [[Planes y beneficios]], [[Definicion de producto y lanzamiento]] y [[Reglas operativas propuestas]]. No implica desarrollo ni cobros activados.

## Resultado y alcance
Una persona elegible selecciona su tipo, crea su cuenta, completa la incorporación y elige su plan antes de recibir el correo de confirmación. Solo el enlace del correo confirma la cuenta y concede acceso. Si es estudiante, primero envía su acreditación y conserva acceso gratuito durante la revisión; el cobro Estudiante queda deshabilitado hasta la aprobación. La confirmación de pago activa exactamente un periodo de beneficios.

Incluye: registro, correo, acceso gratuito, validación manual, selección de plan, pago y consulta de activación. Recuperación de contraseña es una dependencia del acceso. Candidaturas, creación de CV, mentorías y Verify aparecen como destinos posteriores; implementarlos es requisito antes de cobrar el plan completo, no parte de este recorrido.

## Reglas confirmadas
- El recorrido comienza eligiendo tipo de usuario, antes de crear cuenta. Administrador no es una opción de registro público.
- México; acceso desde 18 años.
- Gratis: tres postulaciones a empleos por mes, sin beneficios adicionales.
- Estudiante: preparatoria o superior, acreditación vigente, $50 MXN/mes, una mentoría individual por periodo.
- Inicio Profesional: egresados y profesionales sin experiencia, $200 MXN/mes, cuatro mentorías individuales por periodo.
- Revisión manual de credencial o constancia; revisión periódica cuya frecuencia está pendiente.
- Beneficios completos en [[Planes y beneficios]]; sin Scrum, horarios flexibles.

Todo detalle restante de esta nota es propuesta de producto o diseño técnico, no condición publicada.

## Recorrido principal propuesto
0. Elegir tipo de usuario antes de crear cuenta. Opciones propuestas: estudiante; egresado o profesional sin experiencia; mentor o guía; empresa; universidad o institución. Conservar la selección al avanzar y permitir corregirla antes de enviar el registro. Administrador no se ofrece ni se acepta como tipo público desde el servidor.
1. Elegir crear cuenta y declarar mayoría de edad mediante fecha de nacimiento. Mostrar alcance de acceso antes de enviar datos.
2. Registrar nombre, correo, contraseña y aceptación de las condiciones disponibles. Alias opcional; no solicitar domicilio, CURP ni identificación oficial por defecto. La declaración de edad no equivale a verificación documental de identidad.
3. Completar la incorporación según el tipo. Para Estudiante, capturar institución, nivel y evidencia; su estado inicial queda pendiente de revisión. Para mentor y organización, guardar la intención de incorporación sin conceder permisos verificados.
4. Elegir la intención de plan. El estudiante ve que el cobro quedará disponible tras aprobar su acreditación y que mientras tanto tendrá acceso gratuito.
5. Enviar el correo de confirmación cuando la incorporación quedó completa.
6. Confirmar mediante enlace temporal y de un solo uso. Ningún botón de la aplicación puede sustituir la comprobación del token recibido por correo.
7. Redirigir al dashboard de talento o al workspace de mentor u organización según el tipo de cuenta.
8. Revisar manualmente la acreditación estudiantil. Aprobar, pedir corrección o rechazar con motivo comprensible; durante la revisión se conserva el plan gratuito.
9. Tras aprobar, habilitar el pago Estudiante. Inicio Profesional puede continuar al pago sin acreditación académica.
10. Recibir confirmación verificada de pago en servidor y activar exactamente un periodo de beneficios.
11. Mostrar estado activo, plan, inicio y fin del periodo, cupo de mentorías y siguiente paso. La evidencia académica permanece privada.

Inicio Profesional pasa del paso 4 al 8, sin esperar validación de estudiante. No ofrecer conversión automática a un plan más caro si se rechaza la acreditación.

**Orden vigente para Estudiante:** elegir tipo → crear cuenta → enviar acreditación → elegir intención de plan → confirmar correo desde el enlace → entrar con plan gratuito → revisión manual → habilitar cobro al aprobar → pagar → activar beneficios.

La selección de tipo expresa intención, no concede permisos: mentor y representante de organización siguen su validación correspondiente. No se les atribuyen los planes de talento ni requisitos académicos; sus condiciones comerciales siguen pendientes. Administradores se habilitan por un procedimiento interno autorizado, por definir. No permitir autoasignación administrativa mediante formularios, URL ni peticiones directas.

## Estados independientes
| Objeto | Estados propuestos | Regla |
| --- | --- | --- |
| Cuenta | correo pendiente, habilitada, restringida, cerrada | Correo pendiente no habilita postulaciones ni pago. Restricción prevalece sobre el plan. |
| Acreditación | sin solicitud, borrador, pendiente, requiere corrección, aprobada, rechazada, vencida | Aprobada no significa pagada. Reenvío crea una revisión vinculada; no borra la decisión anterior. |
| Orden de pago | creada, pendiente, confirmada, fallida, cancelada, en conciliación | El retorno del navegador no confirma el pago. |
| Suscripción | sin plan de pago, activación pendiente, activa, vencida | En esta primera compra no se modelan todavía cambios de plan ni prorrateos. |
| Beneficios | gratuito o derechos del periodo activo | El servidor deriva derechos; el cliente no puede asignarse plan ni cupos. |

Transiciones de acreditación: borrador → pendiente → aprobada / requiere corrección / rechazada; corrección → pendiente con evidencia nueva; aprobada → vencida al aplicar política de vigencia. Solo revisión autorizada decide; no usar IA para aprobación automática.

## Excepciones y recuperación
| Situación | Respuesta propuesta |
| --- | --- |
| Menor de 18 años | Bloquear registro y explicar el requisito. No pedir documentos académicos ni cobrar. Definir retención mínima de intentos antes de implementar. |
| Correo ya registrado | Respuesta que no exponga innecesariamente existencia de cuentas; ofrecer iniciar sesión o recuperar acceso. |
| Enlace caducado o correo no recibido | Reenvío con límite de frecuencia; mantener progreso sin cuentas duplicadas. |
| Documento ilegible o vigencia incierta | Solicitar corrección específica; no asumir fraude. Permitir reemplazar evidencia sin publicar archivos. |
| Rechazo | Mostrar motivo y canal de revisión; conservar cuenta gratuita. |
| Error al cargar archivo | Mantener campos no sensibles y permitir reintentar; no aceptar extensión como única validación del archivo. |
| Dos revisores actúan a la vez | Verificación de versión: solo la primera decisión válida se aplica; el segundo actualiza la vista. |
| Pago rechazado o abandonado | Mantener acreditación y acceso gratuito; permitir nueva orden cuando la anterior no pueda confirmarse. |
| Pago pendiente | Mostrar comprobación en curso; consultar estado y evitar pedir pagar de nuevo mientras existe riesgo de duplicación. |
| Pago confirmado con navegador cerrado | Activar desde servidor y notificar; mostrar estado al regresar. |
| Evento de pago duplicado | No duplicar periodo, cupos ni aportación. |
| Pago tardío tras vencimiento de acreditación | Conciliar manualmente; no perder el dinero recibido ni conceder plan sin elegibilidad. Resolver activación o devolución según política aprobada. |
| Cargo confirmado pero activación falló | Mantener activación pendiente, reintentar y escalar; nunca volver a cobrar para resolverlo. |
| Acreditación vence durante un periodo pagado | No definir retirada automática sin política aprobada. La pantalla informa próxima revisión; bloqueo de renovación y tratamiento del periodo por decidir. |

## Datos y permisos
Cuenta: identificador, nombre, correo verificado, credencial de acceso protegida, fecha de nacimiento si se aprueba y aceptación versionada. Acreditación: propietario, institución, nivel, vigencia, referencia privada al archivo, estado, revisor, motivo y fechas. Orden: propietario, plan y precio fijados por servidor, moneda, identificador externo, estado e idempotencia. Periodo: propietario, plan versionado, pago, inicio, fin y cupos. Registro de acciones: actor, recurso, transición y fecha, sin contenido de documentos ni contraseñas.

| Actor | Puede | No puede |
| --- | --- | --- |
| Persona | Consultar su estado, enviar su evidencia y solicitar su orden | Leer documentos ajenos, aprobarse o modificar precio |
| Revisor académico | Consultar solicitudes asignadas o autorizadas y resolver con motivo | Modificar cobros, descargar masivamente documentos o revisar su propia solicitud |
| Soporte | Ver estado y abrir incidencia con datos mínimos | Aprobar estudios o ver documentos completos por defecto |
| Integración de pagos | Actualizar orden autenticada tras verificar importe, moneda y referencia | Aceptar el plan o resultado que declare el navegador |
| Empresas y mentores | Ningún acceso a esta evidencia por su rol | Consultar acreditaciones privadas |

Los permisos son por recurso y función, no una cuenta administradora compartida. Retención y borrado de evidencia pendientes; no guardar documentos indefinidamente por omisión.

## Contratos lógicos propuestos
Independientes del framework y proveedor:
- Registrar cuenta y confirmar correo: respuestas sin secretos, validación y reintentos seguros.
- Consultar mi incorporación: estado de cuenta, acreditación, plan y acción disponible.
- Enviar acreditación: devuelve ID y estado, con versión para control de concurrencia.
- Resolver acreditación: exige permiso, versión esperada, decisión y motivo.
- Crear orden: exige plan permitido y elegibilidad; precio desde catálogo del servidor, clave de idempotencia.
- Consultar orden propia y recibir evento del proveedor: validar firma o mecanismo equivalente, ambiente, referencia, importe y MXN; conciliar antes de activar.
- Activar periodo: transacción o proceso recuperable que enlaza pago, periodo, derechos y registro de aportación sin duplicados.

No almacenar datos de tarjeta en Hongus como parte de este diseño; usar checkout del proveedor cuando sea seleccionado. Un adaptador simulado permite probar el flujo antes de contratarlo, pero no sirve para cobrar en producción.

## Decisiones pendientes antes de producción
1. Método de comprobación de edad y datos mínimos necesarios; fecha declarada es propuesta inicial.
2. Vigencia académica, plazo de revisión, periodo de revalidación y tratamiento de vencimientos durante pago.
3. Ciclo mensual, límites de fecha y zona horaria; renovación automática o manual, impuestos, comisiones y cancelaciones.
4. Formatos, tamaño máximo, conservación y acceso a documentos. Propuesta inicial técnica: PDF, JPEG y PNG hasta 5 MB, validación de contenido y revisión segura.
5. Proveedor de pagos, responsable de conciliación y reglas de devolución.

Se puede trabajar pantallas y contratos con estas decisiones marcadas; no publicar textos definitivos ni activar cobros hasta resolverlas.

## Verificación y medición
Prueba completa: cuenta nueva → correo → evidencia → revisión → pago de prueba → una activación con cupos correctos. También probar menores, rechazo corregible, acceso cruzado, doble revisión, eventos duplicados y pago confirmado después de abandonar la página.

Medir tiempos entre solicitud y resolución, abandono por pantalla y pago confirmado frente a activación efectiva. No recopilar contenido de documentos en analítica. Éxito operativo: persona entiende su estado y siguiente acción; pago y beneficios coinciden sin duplicados.

Pantallas: [[Pantallas de registro y activacion]]. Tareas: [[Tickets de registro y activacion]].
