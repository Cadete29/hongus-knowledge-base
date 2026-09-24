# Tickets iniciales

Estado: mapa histórico de entregables. La ejecución diaria y los folios oficiales están en [[Sistema de tickets en Linear]]. Los identificadores `HNG` de esta nota son referencias de planificación y no deben usarse en ramas ni pull requests.

| ID | Entregable | Dependencia | Criterios de aceptación |
| --- | --- | --- | --- |
| HNG-001 | Validar recorridos y alcance | Ninguna | Los cinco roles tienen inicio, resultado, rechazos y recuperación; dirección acepta el alcance. |
| HNG-002 | Política operativa | HNG-001 | Decisiones sobre cancelaciones, cupos, reembolsos y responsable de resolución registradas; excepciones explícitas. |
| HNG-003 | Matriz de permisos y datos | HNG-001 | Cada acción tiene actor y recursos accesibles; se impide acceso cruzado a candidaturas y documentos. |
| HNG-004 | Prototipo del recorrido | HNG-001 | Registro, acreditación, pago, postulación, reserva y logro tienen estados de error y éxito; usa identidad aprobada. |
| HNG-005 | Selección técnica y costos | HNG-003 | Comparación vigente de alternativas, decisión documentada y presupuesto mensual con supuestos. |
| HNG-006 | Base de cuentas y revisiones | HNG-003 y HNG-005 | Correo, edad, permisos y revisión manual funcionan; se prueban denegaciones. |
| HNG-007 | Oportunidad y candidatura interna | HNG-006 | Solo publicaciones aprobadas aceptan envíos; cierre y duplicados controlados; organización solo ve sus candidaturas. |
| HNG-008 | Pagos y beneficios | HNG-002 y HNG-005 | Confirmación repetida no duplica beneficios; cupos por plan y cancelación se prueban; cobro fallido no activa. |
| HNG-009 | Reservas y extras | HNG-006 y HNG-008 | No hay doble reserva; caducidad, enlaces, cancelación y reparto 75/25 trazables. |
| HNG-010 | CV con IA y Verify | HNG-006 y HNG-008 | Variantes según plan; no inventa logros; emisión exige confirmante y evidencia; corrección trazable. |
| HNG-011 | Contactos, guías y consultas | HNG-006 y HNG-008 | Solicitudes aceptables o rechazables; propuestas de organización por asunto; recursos por plan. |
| HNG-012 | Preparación de producción | HNG-007 a HNG-011 | Recorrido completo probado; respaldo restaurado; soporte, oportunidades y capacidad de mentoría comprobados. |

El stack inicial ya fue implementado en `proyecto/`; consultar [[Estado actual del desarrollo]]. Para trabajo nuevo se crea un ticket `HON-n` en Linear antes de abrir una rama. Ver [[Equipo y ejecucion]] y [[proyecto/GITHUB_WORKFLOW|Flujo de GitHub y pull requests]].
