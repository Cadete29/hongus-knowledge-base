# Backend de Hongus

API de autenticación con Node.js, Express y PostgreSQL.

## Estructura

- `server.js`: abre el puerto y programa el envío de correos pendientes.
- `src/app.js`: configura Express y monta las rutas; se puede importar sin iniciar el servidor.
- `src/config/`: variables de entorno y conexión a PostgreSQL.
- `src/routes/`: URLs y métodos HTTP.
- `src/controllers/`: peticiones, respuestas y cookies.
- `src/services/`: límites de peticiones, sesiones, MFA y correos.
- `src/models/`: consultas de datos reutilizables.
- `src/middlewares/`: protección de peticiones y manejo de errores.
- `src/utils/`: funciones de seguridad.
- `src/migrate.js` y `migrations/`: esquema de base de datos.

## Inicio

1. Copia `.env.example` a `.env` y configura `DATABASE_URL` para tu PostgreSQL. El archivo `.env` no
   se publica en Git.
2. Ejecuta `pnpm install`.
3. Ejecuta `pnpm migrate`.
4. Ejecuta `pnpm dev` para desarrollo o `pnpm start` para iniciar normalmente.

Para una instalación nueva, genera una clave aleatoria de 32 bytes en base64url y guárdala como
`MFA_ENCRYPTION_KEY` en `.env`. Conserva esa clave: perderla impide descifrar los secretos MFA ya
configurados. Nunca subas `.env` a Git.

`MAIL_MODE=log` muestra los correos en la consola para pruebas. `MAIL_MODE=smtp` permite configurar
un servidor SMTP mediante las variables del archivo de ejemplo.

Para conectar el servicio de correo y probar SMTP, sigue [EMAIL_SETUP.md](../EMAIL_SETUP.md) y
ejecuta `pnpm mail:verify`. La configuración local está preparada para Gmail mediante
`smtp.gmail.com:587`; permanece en `MAIL_MODE=log` hasta que agregues el usuario y la contraseña de
aplicación y cambies el modo a `smtp`.

La API responde en `/api/v1`; `GET /api/v1/health` comprueba la conexión a PostgreSQL.

## Seguridad de autenticación

- Contraseñas nuevas con Argon2id. Las contraseñas `scrypt` existentes se verifican y migran a
  Argon2id al iniciar sesión.
- Validación de entrada con Zod, cabeceras de Helmet y límites de intentos persistidos en
  PostgreSQL.
- Sesiones opacas en cookies `HttpOnly`, `SameSite=Lax` y `Secure` en producción. El token CSRF está
  ligado a la sesión y se exige para cambios autenticados.
- `POST /api/v1/sessions/refresh` rota la sesión. Reutilizar un token rotado revoca su familia.
  `GET /api/v1/sessions`, `DELETE /api/v1/sessions/:sessionId` y `POST /api/v1/sessions/logout-all`
  permiten revisar y cerrar accesos.
- MFA TOTP opcional con secreto cifrado, prevención de reutilización de códigos y ocho códigos de
  recuperación de un solo uso. Las rutas son `/api/v1/mfa/status`, `/setup`, `/enable`, `/disable` y
  `POST /api/v1/sessions/mfa`.
- El registro exige consentimiento explícito y guarda fecha, versión y SHA-256 de los Términos y del
  Aviso de Privacidad aceptados. El contenido y su archivo histórico están en `../shared/`.

Los cambios de esquema están en `migrations/002_auth_security.sql` a
`007_onboarding_before_confirmation.sql`; `pnpm migrate` los aplica en orden. Las migraciones 006 y
007 agregan suscripciones y el proceso limitado previo a la confirmación.

El endpoint `POST /accounts` crea una cuenta pendiente y devuelve un token temporal de
incorporación. `POST /accounts/onboarding` guarda la intención de plan y, para estudiantes, los
datos de acreditación; solo entonces se genera el correo. El token de incorporación no crea una
sesión ni permite acceder a recursos autenticados.

Ejecuta `pnpm test` para las pruebas unitarias y `pnpm test:integration` para sesiones, CSRF,
rotación y MFA contra la base configurada. La prueba de integración crea y borra una cuenta
temporal. El workflow `.github/workflows/auth-security.yml` añade estas pruebas, compilación del
frontend y auditoría de dependencias en CI.

Si la API corre tras un proxy de confianza, configura `TRUST_PROXY=true` solo cuando el proceso no
sea accesible directamente desde Internet.
