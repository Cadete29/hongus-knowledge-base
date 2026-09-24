# Hongus · autenticación y correo

Empieza por [DEVELOPMENT.md](DEVELOPMENT.md) para instalar todas las herramientas y levantar el
proyecto desde un clon nuevo. El comportamiento esperado de registro, confirmación, planes y
workspaces está en [AUTH_FLOW.md](AUTH_FLOW.md). El trabajo con tickets, ramas y pull requests está
en [GITHUB_WORKFLOW.md](GITHUB_WORKFLOW.md).

## Estructura

- `frontend/`: React y Vite. `App.jsx` renderiza páginas completas de `src/pages/`; los componentes
  y estilos usan CSS Modules.
- Las páginas de acceso siguen los frames **AUTH-01 a AUTH-11** y los estados de registro de
  [Figma](https://www.figma.com/design/j9XxATYB1A70u3msjLzmB3/Hongus-%C2%B7-Landing-page?node-id=45-288):
  panel de identidad en escritorio, formulario de 480 px y composición móvil de una columna.
- `backend/`: API Express, sesiones y tokens persistidos en PostgreSQL, MFA, plantillas HTML/texto y
  cola de correo SMTP. Su estructura y seguridad están documentadas en
  [backend/README.md](backend/README.md).
- `compose.dev.yml`: PostgreSQL aislado y opcional para practicar Docker.

## Arranque local con tu PostgreSQL y pgAdmin

La configuración local ya apunta a tu base `honbo` en `localhost:5432`. La contraseña vive en
`backend/.env`, que Git ignora. Las tablas de autenticación ya fueron creadas y el flujo de
registro, confirmación, sesión y recuperación fue probado contra esa base.

1. En `backend/`: `pnpm dev`.
2. En otra terminal, en `frontend/`: `pnpm dev`.
3. Abre `http://localhost:5173`.

Si preparas otra máquina o cambias de base, copia `backend/.env.example` a `backend/.env`, ajusta
`DATABASE_URL` y ejecuta `pnpm migrate` antes de iniciar el servidor.

La API escucha en `localhost:3000` y Vite redirige `/api` al backend. En desarrollo, `MAIL_MODE=log`
imprime los enlaces de confirmación y recuperación en la consola del backend. Para envíos reales usa
`MAIL_MODE=smtp` y define host, puerto, usuario, contraseña y remitente en `backend/.env`. Nunca
pongas secretos en el frontend.

Para validar la API con Postman, importa la colección de `postman/` y sigue
[POSTMAN.md](POSTMAN.md).

La configuración paso a paso está en [EMAIL_SETUP.md](EMAIL_SETUP.md).

Los Términos y el Aviso de Privacidad están publicados en las rutas de la aplicación
`/terminos-y-condiciones` y `/aviso-de-privacidad`. Las decisiones y la revisión pendiente antes de
producción están en [LEGAL.md](LEGAL.md).

## Aprender Docker sin cambiar tu base actual

Consulta [DOCKER.md](DOCKER.md). `compose.dev.yml` levanta **otra** base PostgreSQL en el puerto
5433; no modifica `honbo` ni es necesaria para trabajar hoy.

## Endpoints

| Método | Ruta                                 | Uso                                                                 |
| ------ | ------------------------------------ | ------------------------------------------------------------------- |
| POST   | `/api/v1/accounts`                   | Registro                                                            |
| POST   | `/api/v1/accounts/onboarding`        | Completar perfil, intención de plan y acreditación previa al correo |
| POST   | `/api/v1/email-confirmations`        | Confirmar enlace                                                    |
| POST   | `/api/v1/email-confirmations/resend` | Reenviar enlace                                                     |
| POST   | `/api/v1/sessions`                   | Iniciar sesión                                                      |
| GET    | `/api/v1/sessions/current`           | Leer sesión                                                         |
| DELETE | `/api/v1/sessions/current`           | Cerrar sesión                                                       |
| POST   | `/api/v1/password-resets`            | Solicitar recuperación                                              |
| POST   | `/api/v1/password-resets/complete`   | Cambiar contraseña                                                  |
| GET    | `/api/v1/health`                     | Estado de base de datos                                             |
| GET    | `/api/v1/onboarding`                 | Estado del workspace y suscripción                                  |
| POST   | `/api/v1/subscription-orders`        | Crear orden desde catálogo del servidor                             |

Las solicitudes de escritura exigen `Origin` igual a `APP_ORIGIN` y JSON cuando llevan cuerpo. El
navegador guarda una cookie de sesión opaca `HttpOnly` y otra de CSRF; ambas usan `SameSite=Lax` y
son `Secure` en producción con HTTPS. Los tokens de confirmación y recuperación se almacenan como
hashes y se consumen una sola vez. La cola borra el cuerpo del correo tras el envío.

Las operaciones autenticadas también exigen un token CSRF ligado a la sesión. Se pueden rotar y
revocar sesiones, y activar MFA con una aplicación de autenticación. Las contraseñas nuevas usan
Argon2id; las existentes se migran al iniciar sesión.

El registro se completa antes de enviar el correo. La confirmación solo ocurre al consumir el token
del botón del email; entonces el backend abre la sesión y devuelve el workspace correspondiente.

## Producción

Configura HTTPS y un proxy inverso que sirva el frontend compilado y envíe `/api` al proceso backend
bajo el mismo origen. Ajusta `APP_ORIGIN` al dominio HTTPS público, `NODE_ENV=production`,
`DATABASE_URL`, `MAIL_MODE=smtp` y las variables SMTP. Ejecuta `pnpm migrate` antes de iniciar el
backend. Las credenciales de `compose.dev.yml` son exclusivamente locales.

Las plantillas UX/UI están en la página **03 · Correos transaccionales** del
[archivo Figma Hongus](https://www.figma.com/design/j9XxATYB1A70u3msjLzmB3/Hongus-%C2%B7-Landing-page).
