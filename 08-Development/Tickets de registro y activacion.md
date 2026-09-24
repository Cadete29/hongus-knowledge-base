# Tickets de registro y activación

Estado: desglose funcional de referencia. Los tickets ejecutables están publicados en [[Sistema de tickets en Linear]] con folios `HON-n`. Detallan el alcance histórico de HNG-004, HNG-006 y HNG-008 de [[Tickets iniciales]]. Trabajo asíncrono, sin Scrum ni sprints; cada responsable acuerda entrega según disponibilidad.

## Distribución de revisión
Janice: pantallas, comportamiento de interfaz y validación funcional. Segundo líder: contratos, datos, permisos e integración. Ambos: revisión cruzada y entrega integrada. Administración: revisión práctica del flujo académico. Dirección: reglas de negocio pendientes. No requiere que cada líder programe personalmente todas sus tareas.

### REG-T01 Especificación y prototipo de pantallas
Responsable propuesto: Janice. Dependencia: revisión de [[Registro validacion y activacion]]. Entregable: prototipo REG-00 a REG-08 y ADM-01/02 con datos ficticios. Comenzar por selección de tipo sin administrador; conservar selección y dirigir al recorrido correspondiente.
Aceptación: se puede recorrer registro gratuito, acreditación aprobada, corrección y pago pendiente; la persona identifica siguiente acción y no interpreta revisión como cobro. Vista móvil y teclado contemplados. Política pendiente visible en especificación, no sustituida con términos inventados.

### REG-T02 Estados datos y permisos
Responsable propuesto: segundo líder, revisión de Janice. Dependencia: especificación.
Entregable: esquema, transiciones y contratos lógicos de cuenta, solicitud, orden y periodo.
Aceptación: separar correo, acreditación y suscripción; revisión no activa beneficios; titular no puede resolver su solicitud; organización no lee evidencias. Concurrencia de dos revisores rechaza decisión sobre versión antigua. No seleccionar proveedor por implementar el modelo.

### REG-T03 Registro y correo
Responsables propuestos: segundo líder en lógica y Janice en integración. Depende de T01 y T02 y selección técnica HNG-005.
Entregable: registro, confirmación y recuperación de enlaces con límites de envío.
Aceptación adicional: validar tipo público en servidor; rechazar administrador o permisos administrativos enviados manualmente; tipo elegido no equivale a rol verificado. Mentor y organización no entran en acreditación académica ni reciben derechos de talento por omisión.
Aceptación: entrada bajo edad mínima se bloquea según política acordada; enlace de un solo uso y vencimiento; reintento no duplica cuenta; error no expone credenciales; cuenta sin correo confirmado no postula ni paga. Método de edad final debe estar aprobado antes de producción.

### REG-T04 Solicitud y archivos privados
Responsables propuestos: segundo líder en almacenamiento y Janice en formulario. Depende de T03 y política de archivos.
Aceptación: archivo válido queda privado y asociado al titular; archivo inválido rechazado por contenido y tamaño; otra cuenta no puede descargarlo cambiando ID; fallo de carga permite reintentar; reenvío conserva referencia de revisión y evita solicitudes paralelas conflictivas.

### REG-T05 Bandeja de administración
Responsables propuestos: Janice y segundo líder; administración valida. Depende de T04.
Aceptación: revisor autorizado aprueba, pide corrección o rechaza con motivo; acción registra actor y fecha; decisión simultánea se detecta; titular recibe estado y siguiente acción; soporte sin permiso documental no ve el archivo. No hay aprobación académica por IA.

### REG-T06 Selección de plan y orden
Responsables propuestos: Janice en resumen y segundo líder en orden. Depende de T03, T05 para Estudiante y política de cobro.
Aceptación: Gratis funciona sin checkout; Estudiante exige acreditación aprobada vigente; Inicio Profesional no exige acreditación; importe y MXN se fijan en servidor; manipular precio en cliente no funciona; doble clic con misma clave no crea dos órdenes cobrables. No cobrar en ambiente productivo durante pruebas.

### REG-T07 Confirmación y activación recuperable
Responsable propuesto: segundo líder; revisión cruzada. Depende de T06 y proveedor aprobado para integración real. Puede comenzar con adaptador simulado.
Aceptación: confirmar autenticidad y coincidencia de importe/moneda/orden; evento duplicado produce un periodo; pago sin navegador activa; fallo después del pago queda recuperable sin recobro; discrepancia va a conciliación; plan Estudiante obtiene 1 mentoría e Inicio Profesional 4. Aportación de ingreso propio se registra una vez conforme a base aprobada; no confundir con reparto de extras.

### REG-T08 Resumen activo y notificaciones
Responsable propuesto: Janice, contratos del segundo líder. Depende de T07.
Aceptación: mostrar fechas y cupos reales; pago pendiente no se anuncia activo; recarga conserva estado; notificación fallida no revierte un pago confirmado; datos académicos no se publican con el perfil.

### REG-T09 Pruebas integrales y entrega
Responsables propuestos: ambos líderes, validación operativa de administración. Depende de T03 a T08.
Aceptación: evidencia de recorrido de ambos planes y gratuito, denegación de acceso cruzado, rechazo corregible, cuenta menor, doble clic, evento duplicado, navegador cerrado y activación recuperada. Los beneficios del resto de Hongus deben estar operativos antes de habilitar compra pública. No marcar lanzamiento listo únicamente porque funciona checkout.

## Orden de ejecución y cierre
Primero T01 y T02 en paralelo; después T03 a T05, luego T06 a T08 y T09. Integrar en incrementos pequeños, revisión de otra persona y evidencia en cada ticket. Registrar bloqueos por decisión, dependencia o disponibilidad; revisar fechas estimadas al cambiar alguno. No hay estimación de horas sin conocer disponibilidad y stack.
