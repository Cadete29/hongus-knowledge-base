# Decisiones técnicas y evolución

Arquitectura v1.1. Estructura confirmada: proyecto en una carpeta raíz con backend/ y front/, según petición del fundador. Las demás filas son recomendaciones explícitas del diseño, no aprobaciones del fundador ni compras autorizadas.

| ID | Propuesta | Motivo | Alternativa o disparador de cambio |
| --- | --- | --- | --- |
| ARQ-00 | Carpeta raíz hongus/ con backend/ y front/; estructura confirmada | Proyecto completo organizado en un solo lugar, según instrucción del fundador | Worker, migraciones y contratos dentro de backend; repositorio único propuesto |
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
