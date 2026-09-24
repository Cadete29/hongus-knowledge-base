# Seguridad y confianza

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


## Controles presentes en la implementación · 24 de septiembre de 2026

El backend actual incorpora hash de contraseñas con Argon2 y compatibilidad de migración, tokens opacos almacenados como digest, expiración y consumo único, sesiones rotables y revocables, cookies seguras, defensa CSRF, límites de frecuencia, Helmet, validación de entrada, MFA TOTP y códigos de recuperación. Los términos y el aviso de privacidad se versionan y se registra evidencia de consentimiento. El correo se envía mediante cola y SMTP configurable.

La confirmación solo ocurre al validar el token del enlace de correo. Siguen pendientes las pruebas integrales, el almacenamiento privado de documentos académicos, la configuración productiva del dominio de correo, la protección de `main`, secretos administrados y la operación de incidentes. Estos pendientes se siguen en HON-6, HON-8, HON-10 y HON-11; ver [[Sistema de tickets en Linear]].
