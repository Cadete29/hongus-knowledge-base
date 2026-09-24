# Pantallas de registro y activación

Estado: especificación de pantallas propuesta; no prototipo implementado. Recorrido [[Registro validacion y activacion]]. Aplicar [[Identidad visual de Hongus]]: Bosque para acciones, Tinta para lectura, Niebla y Blanco para superficies, Lima como acento. No usar únicamente color para indicar estado.

## Inventario de pantallas
| ID | Pantalla y contenido | Acción principal | Alternativa y estados |
| --- | --- | --- | --- |
| REG-00 | Cómo quieres participar: estudiante; egresado o profesional sin experiencia; mentor o guía; empresa; universidad o institución. Etiquetas propuestas, sin administrador | Continuar con este tipo | Iniciar sesión; selección requerida, retorno para corregir; tipo no concede permisos |
| REG-01 | Crear cuenta: nombre, correo, contraseña, fecha de nacimiento propuesta, condiciones y privacidad | Crear mi cuenta | Iniciar sesión; envío, error por campo, error de red y requisito 18+ |
| REG-02 | Confirma tu correo: dirección parcialmente oculta e instrucciones | Reenviar enlace cuando esté permitido | Corregir correo mediante flujo controlado; enlace caducado, envío fallido, confirmado |
| REG-03 | Bienvenida gratuita según tipo. Para estudiante, explicar acreditación y beneficio del plan sin cobrar | Acreditar mis estudios, si corresponde | Continuar gratis; Inicio Profesional puede pasar a elección y pago; mentor y organización siguen su incorporación propia |
| REG-04 | Acredita tus estudios: institución, preparatoria/superior, vigencia y documento | Enviar a revisión | Guardar borrador; formato/tamaño propuestos visibles; carga, error y reintento |
| REG-05 | Estado de tus estudios: fecha de envío, decisión y siguiente paso | Según estado: corregir o continuar al pago | Continuar gratis o pedir revisión; no inventar tiempo de respuesta |
| ADM-01 | Cola de acreditaciones: filtros por estado, fecha e ID | Abrir solicitud | Sin solicitudes, error y cambio de estado por otro revisor |
| ADM-02 | Revisión: evidencia privada, datos y lista de comprobación | Aprobar o solicitar corrección | Rechazar con motivo; confirmación de decisión, conflicto de versión y permisos |
| REG-06 | Elegir plan y revisar pago: opciones elegibles, precio MXN, beneficios, periodo y condiciones aprobadas | Elegir y continuar al pago | Continuar gratis; elegibilidad caducada, proveedor no disponible |
| REG-07 | Resultado: verificando, confirmado, fallido o conciliación | Ver mi plan cuando esté activo | Consultar estado o soporte; no mostrar éxito solo por parámetros de URL |
| REG-08 | Mi plan activo: inicio y fin, mentorías del periodo, acceso y progreso | Completar mi perfil | Explorar oportunidades; fechas reales del servidor y notificación de revisión próxima |

## Distribución y contenido
En móvil, formulario en una columna y resumen debajo; acciones accesibles sin cubrir campos. En escritorio mantener foco en una tarea y mostrar resumen lateral solo en selección y pago. La acreditación tiene tres pasos visibles: datos, documento y revisión. El progreso no debe sugerir que pagar es obligatorio para usar la cuenta gratuita.

Usar etiquetas permanentes, indicación de campos obligatorios, navegación por teclado, foco visible, errores junto al campo y resumen de errores tras enviar. No borrar datos válidos al fallar una carga. Anunciar cambios de estado a tecnologías de asistencia. Evitar temporizadores ficticios o presión para contratar.

## Textos de interfaz propuestos
- Registro: “Tu siguiente paso empieza aquí.”
- Edad: “Hongus estará disponible para personas de 18 años en adelante.” Adaptar a presente al estar operativo.
- Evidencia: “Comparte una constancia o credencial vigente. Se utilizará para revisar tu acceso al plan Estudiante.”
- Pendiente: “Recibimos tu solicitud. Mientras la revisamos, puedes continuar con tu cuenta gratuita.”
- Corrección: “Necesitamos que se vea la vigencia del documento. Puedes enviar una nueva imagen.” Mostrar el motivo real, no este ejemplo siempre.
- Aprobación: “Tus estudios están acreditados. Puedes continuar con el plan Estudiante de $50 MXN al mes.”
- Pago pendiente: “Estamos confirmando tu pago. Puedes volver más tarde para consultar el resultado.”
- Activación: “Tu plan está activo. Completa tu perfil y descubre tu siguiente oportunidad.”

## Revisión antes de implementar
Una persona debe distinguir cuenta activa, estudios aprobados y plan pagado. Validar el flujo gratuito sin bloqueo comercial, el rechazo corregible y el pago pendiente. Ninguna pantalla muestra archivos de acreditación a contactos, mentores o empresas. No usar datos reales de estudiantes en prototipos.


## Flujo vigente en Figma y código · 24 de septiembre de 2026

El recorrido se organiza por tipo de usuario. La secuencia común es selección de tipo → datos de cuenta → incorporación → intención de plan → confirmación mediante el enlace del correo → dashboard o workspace. El estudiante entrega datos de acreditación antes del plan; durante la revisión usa Gratis y el cobro Estudiante permanece deshabilitado. Mentor, empresa e institución llegan a un workspace de incorporación y no reciben permisos verificados solo por seleccionar el tipo.

La pantalla de confirmación no contiene una acción “ya confirmé” que conceda acceso. Solo una respuesta válida del backend tras consumir el token puede crear la sesión. La revisión completa contra Figma se gestiona en HON-5.
