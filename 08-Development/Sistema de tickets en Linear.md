# Sistema de tickets en Linear

Estado: activo desde el 24 de septiembre de 2026.

## Espacio de trabajo

- Workspace: [hongus](https://linear.app/hongus)
- Equipo: `Hongus`
- Prefijo oficial: `HON`
- Proyecto inicial:
  [MVP · Autenticación y activación](https://linear.app/hongus/project/mvp-autenticacion-y-activacion-60dfbfdbf5f4)

El identificador que genera Linear, por ejemplo `HON-6`, es el folio único del cambio. Ese mismo
folio aparece en la rama, los commits y el pull request.

## Flujo

| Estado | Uso |
| --- | --- |
| Triage | Solicitud nueva que todavía necesita clasificación. |
| Todo | Ticket definido, pendiente de responsable o inicio. |
| In Progress | Trabajo activo. Una persona responsable por ticket. |
| In Review | Pull request abierto y listo para revisión. |
| Done | PR integrado, validación aprobada y documentación actualizada. |
| Canceled | Trabajo descartado con motivo registrado. |

Un bloqueo no se oculta cambiando el estado: se documenta en el ticket, se vincula la dependencia y
se informa al responsable del producto.

## Campos mínimos de un ticket listo

- título concreto con un resultado observable;
- contexto y objetivo;
- alcance incluido y exclusiones relevantes;
- criterios de aceptación verificables;
- dependencias y tickets bloqueados;
- prioridad;
- área técnica mediante etiqueta;
- proyecto;
- responsable antes de pasar a `In Progress`;
- enlaces a Figma, decisiones o documentación aplicable.

## Etiquetas activas

| Etiqueta | Uso |
| --- | --- |
| `area:frontend` | React, interfaz, UX y accesibilidad. |
| `area:backend` | API, servicios y reglas del servidor. |
| `area:database` | PostgreSQL, modelos y migraciones. |
| `area:security` | Autenticación, autorización y datos sensibles. |
| `area:devops` | CI, entornos, despliegue y operación. |
| `type:feature` | Capacidad nueva. |
| `type:task` | Trabajo técnico u operativo. |

Usar pocas etiquetas estables. La prioridad y el estado se guardan en sus campos de Linear, no como
etiquetas duplicadas.

## Prioridades

| Prioridad | Criterio |
| --- | --- |
| Urgent | Incidente activo, exposición de datos o producción bloqueada. |
| High | Bloquea el recorrido crítico o la preparación de producción. |
| Medium | Necesario para completar el MVP sin bloqueo inmediato. |
| Low | Mejora conveniente que puede esperar. |
| No priority | Solo durante triage; un ticket listo debe tener prioridad. |

## Definición de listo

Un ticket puede comenzar cuando objetivo, criterios, dependencias y diseño necesario están claros.
Las dudas de negocio que cambien el resultado se resuelven antes de programar.

## Definición de terminado

- criterios de aceptación cumplidos;
- PR aprobado e integrado en `main`;
- verificaciones automáticas correctas;
- permisos y casos de error revisados cuando correspondan;
- migraciones y configuración documentadas;
- capturas o evidencia adjuntas;
- documentación de Obsidian actualizada.

## Relación con GitHub

| Elemento | Formato |
| --- | --- |
| Ticket | `HON-6` |
| Rama | `feature/HON-6-acreditacion-estudiantil` |
| Commit | `HON-6 completa acreditacion estudiantil` |
| PR | `[HON-6] Completar acreditación estudiantil` |

La guía ejecutable está en [[proyecto/GITHUB_WORKFLOW|Flujo de GitHub y pull requests]].

## Backlog creado

| Ticket | Resultado |
| --- | --- |
| [HON-5](https://linear.app/hongus/issue/HON-5/validar-el-flujo-completo-de-autenticacion-contra-figma) | Validar el flujo completo contra Figma. |
| [HON-6](https://linear.app/hongus/issue/HON-6/completar-acreditacion-estudiantil-con-archivos-privados-y-revision) | Completar acreditación estudiantil privada y revisión. |
| [HON-7](https://linear.app/hongus/issue/HON-7/integrar-proveedor-de-pagos-y-webhooks-idempotentes) | Integrar pagos y webhooks idempotentes. |
| [HON-8](https://linear.app/hongus/issue/HON-8/configurar-correo-transaccional-de-produccion) | Configurar correo transaccional de producción. |
| [HON-9](https://linear.app/hongus/issue/HON-9/implementar-incorporacion-de-mentor-y-organizacion) | Completar incorporación de mentor y organización. |
| [HON-10](https://linear.app/hongus/issue/HON-10/agregar-pruebas-integrales-del-flujo-de-cuenta-y-suscripcion) | Agregar pruebas integrales. |
| [HON-11](https://linear.app/hongus/issue/HON-11/proteger-main-y-establecer-ci-para-pull-requests) | Proteger `main` y establecer CI. |

Los tickets de bienvenida `HON-1` a `HON-4` pertenecen a la configuración inicial de Linear y no
representan entregables del producto.
