# Configurar el correo de Hongus

El backend ya genera los mensajes de confirmación, bienvenida y recuperación de contraseña. Falta
conectar una cuenta o proveedor **SMTP** para enviarlos fuera de tu computadora.

## 1. Prueba local sin proveedor

En `backend/.env`, deja `MAIL_MODE=log`. Inicia el backend con `pnpm dev` y registra una cuenta de
prueba. El enlace aparecerá en la terminal del backend; no llegará a una bandeja de entrada. Este
modo es solo para desarrollo.

## 2. Prepara el remitente

Necesitas un proveedor que ofrezca envío SMTP y un dominio o dirección que ese proveedor autorice
como remitente. Activa y verifica el dominio o la dirección en su panel. Publica los registros DNS
SPF, DKIM y DMARC que indique el proveedor para mejorar la autenticación y entrega de los mensajes.
Comprueba también que `legalidad@hongus.com` reciba mensajes, porque es el contacto del Aviso de
Privacidad.

El proveedor debe entregarte:

| Dato                          | Variable de Hongus |
| ----------------------------- | ------------------ |
| Servidor SMTP                 | `SMTP_HOST`        |
| Puerto                        | `SMTP_PORT`        |
| Usuario SMTP                  | `SMTP_USER`        |
| Contraseña o clave SMTP       | `SMTP_PASSWORD`    |
| Dirección de envío autorizada | `MAIL_FROM`        |

La contraseña de PostgreSQL o pgAdmin **no sirve** como contraseña SMTP. Utiliza la credencial
específica que emita tu proveedor de correo.

### Gmail para desarrollo

1. Usa una cuenta de Google dedicada a desarrollo; evita utilizar tu cuenta personal principal.
2. Activa la [verificación en dos pasos](https://support.google.com/mail/answer/185839).
3. En la seguridad de la cuenta, crea una **contraseña de aplicación** para Hongus. Si la opción no
   aparece, la cuenta puede estar administrada, usar Protección Avanzada o tener una política que
   las deshabilite.
4. Usa la dirección completa como `SMTP_USER` y la contraseña de aplicación generada como
   `SMTP_PASSWORD`. No uses la contraseña normal de Google.
5. Durante desarrollo, usa esa misma dirección dentro de `MAIL_FROM`, por ejemplo
   `Hongus desarrollo <tu-cuenta@gmail.com>`, para evitar el rechazo de un remitente que Google no
   haya autorizado.

Configuración de Gmail con STARTTLS:

```dotenv
MAIL_MODE=smtp
MAIL_FROM=Hongus desarrollo <tu-cuenta@gmail.com>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu-cuenta@gmail.com
SMTP_PASSWORD=contraseña-de-aplicación-de-16-caracteres
```

Google documenta `smtp.gmail.com` y los puertos 465/587. Gmail resulta adecuado para pruebas de bajo
volumen; antes de producción conviene usar una cuenta del dominio y revisar límites, entregabilidad
y un proveedor transaccional.

## 3. Configura `backend/.env`

Sustituye los valores de ejemplo por los del proveedor. No copies esta contraseña a Git ni al
frontend.

```dotenv
MAIL_MODE=smtp
MAIL_FROM=Hongus <no-reply@tudominio.com>
SMTP_HOST=smtp.tu-proveedor.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=usuario-smtp
SMTP_PASSWORD=clave-smtp
```

Para el puerto **587**, usa `SMTP_SECURE=false`: Hongus exige la actualización a TLS mediante
STARTTLS. Si tu proveedor indica el puerto **465**, usa `SMTP_PORT=465` y `SMTP_SECURE=true` para
iniciar la conexión con TLS. Conserva la validación del certificado TLS.

## 4. Verifica y prueba el envío

En la carpeta `proyecto/backend`, ejecuta:

```powershell
pnpm mail:verify
```

Este comando comprueba conexión, TLS y autenticación **sin enviar un mensaje**. Si falla, revisa
host, puerto, usuario, clave y si tu red o VPS permite conexiones salientes a ese puerto.

Después inicia el backend con `pnpm dev` y crea una cuenta de prueba con un correo tuyo. Deberías
recibir la confirmación; después de abrirla, la bienvenida. También puedes probar recuperación de
contraseña. `mail:verify` no demuestra que el proveedor acepte tu remitente: eso se comprueba con un
envío real.

Hongus guarda los mensajes en una cola de PostgreSQL y reintenta los pendientes. Tras enviarlos,
elimina el HTML y el texto del registro de la cola. En producción `MAIL_MODE=smtp` es obligatorio.

## Problemas comunes

- **Autenticación rechazada:** revisa si el proveedor exige una clave SMTP específica, contraseña de
  aplicación u OAuth; una contraseña normal de buzón puede no servir.
- **Conexión agotada:** comprueba el host, el puerto y las reglas de salida del VPS o red local.
- **TLS falló:** comprueba la combinación 587/STARTTLS o 465/TLS y el certificado del proveedor.
- **El comando verifica, pero no llega el correo:** verifica el remitente, los registros DNS, la
  carpeta de spam y los eventos o rechazos en el panel del proveedor.

Referencia técnica: [transporte SMTP y verificación de Nodemailer](https://nodemailer.com/smtp).
