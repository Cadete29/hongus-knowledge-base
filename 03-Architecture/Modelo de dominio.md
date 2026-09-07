# Modelo de dominio

Estado: modelo conceptual propuesto, pendiente de validar con el recorrido.

| Entidad | Responsabilidad y relaciones |
| --- | --- |
| Persona y cuenta | Representar al participante y su acceso; una persona puede tener varias funciones. |
| Perfil de talento | Competencias, experiencia y preferencias; asociado a una persona. |
| Organización | Empresa o institución; naturaleza pública o privada como atributo separado del tipo. |
| Membresía | Relación persona–organización con permisos y estado. |
| Oportunidad | Pertenece a una organización; requisitos, cierre y estado. |
| Revisión verde | Evidencia, criterio aplicado, resultado y responsable; asociada a una oportunidad. |
| Postulación | Une perfil y oportunidad; conserva estado e historial de cambios. |
| Perfil de mentor | Especialidades y condiciones de participación de una persona. |
| Solicitud de mentoría | Objetivo del talento y estado de la solicitud. |
| Sesión | Mentor, participante, horario, zona horaria y resultado operativo. |

## Ciclos de vida propuestos

Oportunidad: borrador → en revisión → publicada → cerrada. Una revisión puede devolverla para cambios; administración puede retirarla con motivo.

Postulación interna: enviada → en revisión → entrevista → aceptada o rechazada. El talento puede retirarla. El significado de aceptada debe distinguir aceptación de candidatura, oferta y contratación antes de implementar.

La candidatura externa no comparte automáticamente estos estados: abrir un enlace no acredita envío ni aceptación.

## Invariantes propuestas

- Solo integrantes autorizados actúan en nombre de una organización.
- No se reciben postulaciones internas a oportunidades cerradas.
- El equipo de otra organización no puede acceder a las candidaturas.
- Una nueva candidatura a la misma oportunidad requiere una regla explícita para evitar duplicados.
- La edición de un perfil no debe cambiar silenciosamente la evidencia enviada en una candidatura.
- El acceso institucional a datos individuales necesita una relación y permiso definidos.
- Un cambio sustancial de funciones obliga a revisar la clasificación verde.

Ver [[Seguridad y confianza]] para permisos y [[Mentoria one to one]] para sesiones. Las tablas físicas y contratos API se definirán tras aprobar estas reglas.

