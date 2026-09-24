# Capacidades observadas en mice2

Revisión de lectura del repositorio local mice.2, indicado por Alan como referencia de sus habilidades. No se ejecutaron pruebas ni se auditó seguridad, despliegue o autoría individual. La presencia de código demuestra alcance del proyecto, no dominio equivalente de cada integrante.

| Área | Evidencia observada |
| --- | --- |
| Interfaz | React, JavaScript, Vite, CSS Modules; perfiles, administración, proyectos y convocatorias en frontend/src. Leaflet declarado como dependencia. |
| API | Node.js y Express; rutas, controladores, servicios, modelos y middlewares en backend/src. |
| Datos | PostgreSQL mediante pg; consultas parametrizadas y migraciones SQL para usuarios, sesiones, proyectos, convocatorias y postulaciones. |
| Identidad y acceso | Flujos de registro, correo, recuperación y MFA; modelo de sesiones con rotación y revocación. Dependencias Argon2, JWT, Zod, Helmet y rate limiting. Su existencia no certifica seguridad. |
| Correo | Servicio de email y Nodemailer. |
| Calidad | Pruebas con node:test y Playwright, ESLint y workflow GitHub Actions de build, pruebas y auditoría. Las pruebas frontend observadas simulan respuestas de API. No se comprobó el resultado de la integración continua. |

Fuentes: frontend/package.json, backend/package.json, backend/src/app.js, backend/src/routes/index.js, backend/src/models/session.model.js, frontend/src/App.jsx, frontend/e2e/auth.spec.js y .github/workflows/quality.yml del repositorio mice.2.

## Aplicación al equipo de Hongus
El segundo líder fue formado por Alan y conoce las mismas tecnologías según el fundador. Usar este stack como referencia de su formación; confirmar autonomía al asignar entregables. No copiar código ni seleccionar automáticamente el stack de Hongus.

Propuesta de reparto: Janice coordina interfaz, recorridos y validación funcional con participación full stack; segundo líder coordina API, datos e integraciones con revisión compartida. Ambos supervisan y participan en código. El reparto definitivo sigue pendiente de acuerdo con los líderes.

No se atribuye experiencia en pagos, agenda de mentoría o generación de CV con IA a partir de esta revisión: requieren diseño y validación específicos para Hongus.
