# Decisiones vigentes
Actualización al 24 de septiembre de 2026. Fuente: decisiones del fundador y estado verificable de `proyecto/`.

| Área | Decisión vigente |
| --- | --- |
| Marca | Hongus y lema Construye experiencia. Cultiva futuro. aprobados. |
| Visual | Logotipo, paleta, tipografía y aplicaciones de [[Identidad visual de Hongus]] aprobados. |
| Público | México, desde 18 años; estudiantes, egresados y profesionales sin experiencia. Mentores experimentados como acompañantes. |
| Planes | [[Planes y beneficios]]: $50 y $200 MXN mensuales; 1 y 4 mentorías. Gratis: 3 postulaciones/mes. |
| Aportaciones | [[Modelo de negocio]]: 20% de ingresos propios a MICE-LO; extras con reparto exclusivo 75% mentor y 25% MICE-LO. |
| Confianza | [[Contactos y Hongus Verify]]: canal de asuntos y logros confirmados por responsables. |
| Organización del trabajo | Identidad, arquitectura, equipos, desarrollo, tickets y metodología. |

La arquitectura inicial ya está materializada con React/Vite, Node.js/Express y PostgreSQL. La selección de proveedores y el alcance completo de producción siguen pendientes. Ver [[Estado actual del desarrollo]].

## Arquitectura v1 implementada
La carpeta `proyecto/` contiene `backend/` y `frontend/`. En el backend, `src/app.js` compone la aplicación y `server.js` abre el puerto. En el frontend, `App.jsx` renderiza páginas completas y las páginas componen componentes con CSS Modules. No hay proveedor de pagos ni correo productivo contratado; SMTP con Google se usa solo para desarrollo.

Linear es el sistema oficial de tickets con prefijo `HON`. Todo cambio se entrega en una rama vinculada a un ticket y mediante pull request; ver [[Sistema de tickets en Linear]] y [[proyecto/GITHUB_WORKFLOW|Flujo de GitHub y pull requests]].

## Ampliación confirmada · 12 de septiembre de 2026
Los usuarios podrán acceder a cursos y certificaciones. Hongus, como empresa, y las empresas, universidades e instituciones participantes podrán crear convocatorias, proyectos, cursos y certificaciones. La propuesta se amplía hacia oportunidades, formación y desarrollo profesional, conservando el compromiso ambiental.

Fuente de alcance: [[Oportunidades formacion y certificaciones]]. La implementación, los costos, la impartición, los criterios de certificación y la selección de capacidades para el lanzamiento siguen pendientes. Esta decisión no modifica los planes aprobados ni describe funciones ya implementadas.
