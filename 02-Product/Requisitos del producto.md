# Requisitos del producto

Estado: candidatos derivados de [[MVP]]; pendientes de aprobación.

| ID | Capacidad | Criterio de aceptación propuesto |
| --- | --- | --- |
| RF-01 | Perfil de talento | La persona registra etapa formativa, experiencia y objetivo por separado y controla lo compartido. |
| RF-02 | Organización y miembros | Un integrante sin permiso no puede publicar ni leer candidaturas, aunque pertenezca a la entidad. |
| RF-03 | Oportunidades | Una publicación no revisada no aparece como publicada; la oportunidad muestra cierre, requisitos y motivo de clasificación verde. |
| RF-04 | Búsqueda | El talento puede distinguir oportunidades por experiencia y requisitos, sin usar su segmento como exclusión automática. |
| RF-05 | Postulación interna | Se rechaza un envío a una oportunidad cerrada y un reintento no genera duplicados. |
| RF-06 | Seguimiento | La persona consulta su candidatura; otra organización no puede consultarla. |
| RF-07 | Mentoría | Participante y mentor conocen horario y zona horaria; una cancelación actualiza el estado. |
| RF-08 | Administración | Publicar, retirar o reclasificar deja actor, fecha y motivo. |

RF-05 y RF-06 dependen de elegir postulación interna. Si se elige externa, sustituirlos por reglas de derivación y seguimiento con evidencia.

## Calidad por acordar

Rendimiento con carga prevista, disponibilidad, pérdida de datos tolerable, recuperación, accesibilidad, dispositivos y presupuesto. No hay umbrales aprobados.

Especificar cada requisito con [[Plantilla de funcionalidad]], incluyendo vacíos, errores, permisos y reintentos. Contrastar el conjunto con [[Preparacion para codigo]].

