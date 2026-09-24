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
| RF-13 | Registro e incorporación | El tipo se elige antes de crear la cuenta; la incorporación y la intención de plan se completan antes del correo. |
| RF-14 | Confirmación de correo | Solo un token válido del enlace recibido confirma la cuenta y crea acceso; una acción local no puede sustituirlo. |
| RF-15 | Acceso por tipo | Talento entra al dashboard; mentor, empresa e institución entran a su workspace de incorporación. |
| RF-16 | Estudiante en revisión | Conserva Gratis y no puede pagar Estudiante hasta que su acreditación sea aprobada y vigente. |

RF-05 y RF-06 utilizan candidaturas internas, confirmadas en [[Definicion de producto y lanzamiento]]. La inscripción a formación requiere un proceso distinto.

## Calidad por acordar

Rendimiento con carga prevista, disponibilidad, pérdida de datos tolerable, recuperación, accesibilidad, dispositivos y presupuesto. No hay umbrales aprobados.

Especificar cada requisito con [[Plantilla de funcionalidad]], incluyendo vacíos, errores, permisos y reintentos. Contrastar el conjunto con [[Preparacion para codigo]].

La base de RF-13 a RF-16 está implementada y requiere validación integral mediante HON-5, HON-6 y HON-10. Ver [[Estado actual del desarrollo]] y [[Sistema de tickets en Linear]].


## Formación y certificaciones: criterios propuestos
Capacidades confirmadas en [[Oportunidades formacion y certificaciones]]; criterios pendientes de validación.

| ID | Capacidad | Criterio propuesto |
| --- | --- | --- |
| RF-09 | Catálogo ampliado | Distingue convocatorias, proyectos, cursos y certificaciones e identifica organización responsable. |
| RF-10 | Publicadores | Hongus, empresas, universidades e instituciones crean ofertas con permisos por organización y revisión trazable. |
| RF-11 | Acceso a formación | Muestra requisitos, modalidad, fechas, costo y condiciones; distingue inscripción de candidatura laboral. |
| RF-12 | Resultados formativos | Registra inscripción, finalización, aprobación y emisión por separado; identifica emisor y criterios de certificación. |
