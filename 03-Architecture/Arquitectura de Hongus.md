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

La estructura del backend se definirá al conocer el equipo, la capacidad y el alcance. No hay arquitectura aprobada.


Ver [[Modelo de dominio]], [[Decisiones]] y [[Operacion y entornos]].

