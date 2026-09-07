# Preparacion para codigo

Este documento marca la transición entre descubrimiento e implementación. No exige resolver toda la plataforma: sí resolver una primera porción coherente.

## Puerta de entrada

- [ ] Público, problema y resultado inicial acordados.
- [ ] [[MVP]] con un recorrido completo y exclusiones explícitas.
- [ ] Requisitos con criterios de aceptación y fallos relevantes.
- [ ] Prototipo con pantallas y estados necesarios.
- [ ] Entidades, reglas y permisos del recorrido definidos.
- [ ] Decisiones técnicas justificadas en [[Decisiones]].
- [ ] Objetivos de calidad, tratamiento de datos y operación acordados.
- [ ] Forma de medir el resultado y responsable del piloto definidos.

## Paquete para implementar

Cada porción de trabajo debe conectar pantalla, caso de uso, contrato de entrada y salida, persistencia, permisos y verificación. Implementar el recorrido de extremo a extremo para poder probarlo con una persona.

Para cada contrato: campos, tipos, validaciones, errores, autorización y comportamiento de reintentos cuando aplique. Para cada cambio de datos: migración, compatibilidad y recuperación.

## Verificación proporcional

Probar reglas del dominio, acceso a recursos ajenos, integración con almacenamiento y el recorrido principal. Acordar revisiones de accesibilidad, fallos operativos y recuperación según el riesgo del piloto.

La documentación está lista cuando quien implemente no tenga que inventar reglas de negocio para cerrar el recorrido. Lo descubierto durante desarrollo debe volver al vault.
