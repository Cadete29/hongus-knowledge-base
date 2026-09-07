# Arquitectura de Hongus

Estado: diseño lógico propuesto. Web primero y móvil a futuro están confirmados; tecnologías pendientes.

## Estructura de trabajo

La web presenta los recorridos del talento, organizaciones, mentores y administración. Una capa de aplicación concentra reglas, autorización y casos de uso. La persistencia conserva registros y relaciones. Las integraciones resuelven funciones externas que el alcance realmente requiera.

El futuro cliente móvil debería consumir los mismos casos de uso mediante contratos definidos. Diseñar límites compartidos desde el inicio no requiere implementar la app ahora.

## Módulos propuestos

| Módulo | Responsabilidad |
| --- | --- |
| Identidad y acceso | Cuentas, sesiones y recuperación. |
| Organizaciones | Integrantes, permisos y verificación. |
| Talento | Perfil profesional, competencias y visibilidad. |
| Oportunidades | Revisión, clasificación verde, publicación y cierre. |
| Postulaciones | Candidatura, transiciones e historial. |
| Mentorías | Solicitudes, sesiones y seguimiento autorizado. |
| Operación | Moderación, soporte y auditoría. |

Pagos, suscripciones, asesoría con IA y matching avanzado son módulos candidatos posteriores.

## Límites propuestos

- Oportunidades controla publicación y vigencia; postulaciones comprueba esas condiciones al recibir una candidatura.
- Organizaciones define pertenencia; cada caso de uso comprueba permisos sobre el recurso solicitado.
- Mentorías controla sesiones; las notas privadas no forman parte de la vista de reclutamiento.
- Analítica recibe eventos mínimos; no modifica decisiones de contratación.

## Alternativa inicial para evaluar

Una aplicación backend modular con una unidad de despliegue es una candidata para el piloto, frente a la propuesta original de microservicios. Resolver esta elección mediante una decisión documentada al conocer equipo, carga y operación.

El Word menciona React, Vite, Node.js, Express y PostgreSQL, además de múltiples proveedores y herramientas de datos. Se conservan como candidatos, no como selección técnica. Comparar documentación vigente, mantenimiento, costes y ajuste al equipo antes de aprobarlos.

Ver [[Modelo de dominio]], [[Decisiones]] y [[Operacion y entornos]].

