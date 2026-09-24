# Validar el backend de Hongus con Postman

## 1. Inicia el servidor

Desde `proyecto/backend`:

```powershell
node server.js
```

Mantén esa terminal abierta. La raíz `http://localhost:3000/` muestra información de la API. La
comprobación real de API y PostgreSQL es:

```text
GET http://localhost:3000/api/v1/health
```

Debe responder `200` y `{ "status": "ok" }`. Si el proceso no está iniciado, Postman mostrará un
error de conexión; si PostgreSQL no está disponible, `health` responderá `503`.

## 2. Importa la colección

En Postman selecciona **Import → File** y elige `postman/Hongus-Auth.postman_collection.json`. Abre
las variables de la colección y cambia `email` por un correo que puedas consultar. La contraseña de
la variable es una contraseña exclusiva de la cuenta de prueba, no la contraseña real de tu correo.

## 3. Ejecuta el flujo

1. `Salud y base de datos`.
2. `Registro`.
3. Obtén el enlace recibido por correo. En `MAIL_MODE=log`, aparece en la terminal del backend.
4. Copia solo el valor situado después de `?token=` en la variable `confirmationToken`.
5. Ejecuta `Confirmar correo`; Postman conservará las cookies de sesión.
6. Ejecuta `Consultar sesión actual`, `Listar sesiones` y `Estado MFA`.
7. Para probar de nuevo el acceso, ejecuta `Cerrar sesión` y después `Iniciar sesión`.

Las solicitudes `POST` y `DELETE` necesitan el encabezado `Origin: http://localhost:5173`. Las
operaciones autenticadas que modifican información también necesitan `X-CSRF-Token`. La colección
obtiene ese valor de la cookie después de confirmar el correo o iniciar sesión.

## Respuestas frecuentes

| Estado | Significado habitual                                     |
| ------ | -------------------------------------------------------- |
| `200`  | Operación correcta                                       |
| `201`  | Cuenta creada                                            |
| `204`  | Operación correcta sin cuerpo, por ejemplo cerrar sesión |
| `400`  | JSON o datos inválidos                                   |
| `401`  | No existe una sesión válida                              |
| `403`  | Origen, CSRF, confirmación de correo o permiso inválido  |
| `404`  | La combinación de método y ruta no existe                |
| `409`  | El correo ya está registrado                             |
| `415`  | Falta `Content-Type: application/json`                   |
| `429`  | Demasiados intentos                                      |
| `503`  | PostgreSQL no está disponible                            |

Los endpoints completos están documentados en `backend/src/routes/auth.routes.js`.
