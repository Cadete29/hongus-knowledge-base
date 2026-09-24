# Operación y entornos

Arquitectura v1, propuesta. Ventana de apertura: 1 de julio al 1 de octubre de 2027. Trabajo flexible sin Scrum; asignar propietarios y sustitutos de incidentes antes de abrir.

## Entornos y despliegue
Estructura de código vigente: `hongus/backend/` y `hongus/front/`. API y worker se construyen desde backend con entradas distintas; web desde front. Configurar verificaciones por carpeta y pruebas integradas cuando cambie el contrato. La ubicación conjunta no obliga a compartir alojamiento o credenciales. Ver [[Arquitectura de Hongus]].
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


## Entorno implementado · 24 de septiembre de 2026

El desarrollo local usa Node.js 20 o superior, frontend Vite, backend Express y PostgreSQL. `proyecto/compose.dev.yml` permite levantar PostgreSQL con Docker como alternativa; también puede usarse una instalación local y pgAdmin. SMTP se configura con variables de entorno y admite un modo local que registra mensajes sin enviarlos. Las guías están en [[proyecto/DEVELOPMENT|Desarrollo]], [[proyecto/DOCKER|Docker]] y [[proyecto/EMAIL_SETUP|Correo]].

Aún deben configurarse CI, protección de `main`, secretos del entorno de despliegue, proveedor de correo productivo, respaldos, restauración y observabilidad. El flujo de entrega está documentado en [[proyecto/GITHUB_WORKFLOW|GitHub y pull requests]] y se implementará mediante HON-8 y HON-11.
