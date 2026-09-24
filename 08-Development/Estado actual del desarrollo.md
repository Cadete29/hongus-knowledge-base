# Estado actual del desarrollo

Actualizado: 24 de septiembre de 2026.

Esta nota distingue lo que ya existe en `proyecto/` de lo que continúa pendiente. Es la referencia
rápida para mantener alineados producto, diseño, arquitectura, seguridad y ejecución.

## Implementado

- Landing page en React con componentes y CSS Modules.
- Páginas completas renderizadas desde `App.jsx` y composición dentro de `pages/`.
- Backend Node.js y Express separado en configuración, controladores, middlewares, modelos, rutas,
  servicios y utilidades; `src/app.js` compone la aplicación y `server.js` abre el puerto.
- PostgreSQL con siete migraciones para cuentas, tokens, sesiones, MFA, consentimiento legal,
  suscripciones, acreditación e incorporación.
- Registro para estudiante, egresado, mentor, empresa e institución.
- Incorporación y elección de intención de plan antes del envío del correo de confirmación.
- Confirmación por enlace temporal y de un solo uso. La interfaz no concede acceso mediante un botón
  de declaración local.
- Inicio y cierre de sesión, recuperación de contraseña, rotación y revocación de sesiones.
- MFA TOTP y códigos de recuperación en el backend.
- Límites de frecuencia, cookies seguras, CSRF y encabezados de seguridad.
- SMTP configurable, modo local de registro y plantillas para confirmación, recuperación y bienvenida.
- Plan gratuito, planes Estudiante e Inicio Profesional, órdenes y activación simulada.
- Dashboard de talento y workspaces iniciales para mentor y organización.
- Términos y aviso de privacidad versionados con evidencia de consentimiento.
- Colección de Postman y documentación de instalación, Docker, correo, API y flujo de autenticación.
- Formato común con Prettier; lint y build del frontend; pruebas del backend.

## Pendiente antes de producción

- Carga privada y revisión operativa completa de evidencia académica.
- Proveedor de pagos real, webhooks, conciliación, devoluciones y política comercial final.
- Proveedor de correo de producción y autenticación del dominio.
- Incorporación verificable de mentores, empresas e instituciones.
- Pruebas integrales automatizadas del navegador y de PostgreSQL.
- CI obligatorio y protección de la rama `main`.
- Despliegue, respaldos, restauración, observabilidad y respuesta a incidentes.
- Revisión legal profesional de términos, privacidad y tratamiento de documentos.

## Verificación más reciente

- Backend: 7 pruebas aprobadas.
- Frontend: ESLint correcto.
- Frontend: build de Vite correcto.
- Formato: archivos compatibles validados con Prettier.

## Referencias

- [[Registro validacion y activacion]]
- [[Arquitectura de Hongus]]
- [[Seguridad y confianza]]
- [[Pantallas de registro y activacion]]
- [[Sistema de tickets en Linear]]
- [[proyecto/DEVELOPMENT|Guía de desarrollo]]
- [[proyecto/AUTH_FLOW|Flujo técnico de autenticación]]
- [[proyecto/GITHUB_WORKFLOW|GitHub y pull requests]]
