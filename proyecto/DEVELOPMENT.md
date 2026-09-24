# Guía de desarrollo de Hongus

Esta guía lleva a una persona desde el repositorio de GitHub hasta una instalación local funcional.

## 1. Tecnologías

| Área                    | Tecnología             | Versión recomendada  |
| ----------------------- | ---------------------- | -------------------- |
| Control de versiones    | Git                    | 2.45 o posterior     |
| Runtime                 | Node.js                | 22 LTS               |
| Backend                 | Express                | 5                    |
| Frontend                | React + Vite           | React 19, Vite 8     |
| Base de datos           | PostgreSQL             | 17                   |
| Administración de datos | pgAdmin                | 4 actual             |
| Paquetes backend        | pnpm mediante Corepack | versión del lockfile |
| Paquetes frontend       | npm                    | incluido con Node.js |
| Pruebas de API          | Postman                | actual               |
| Contenedores opcionales | Docker Desktop         | actual               |

También se necesita un editor como Visual Studio Code y acceso de lectura al repositorio.

## 2. Obtener el proyecto desde GitHub

1. Abre [Cadete29/hongus-knowledge-base](https://github.com/Cadete29/hongus-knowledge-base).
2. Selecciona **Code** y copia la URL HTTPS.
3. En PowerShell ejecuta:

   ```powershell
   git clone https://github.com/Cadete29/hongus-knowledge-base.git
   cd hongus-knowledge-base\proyecto
   ```

4. Comprueba las herramientas:

   ```powershell
   git --version
   node --version
   npm --version
   corepack --version
   ```

Node debe mostrar una versión 22. Si `pnpm` no existe, ejecuta:

```powershell
corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

Si Windows rechaza `corepack enable` por permisos, abre PowerShell como administrador únicamente
para ese comando.

## 3. Preparar PostgreSQL

### Opción A: PostgreSQL instalado

1. Instala PostgreSQL 17 y pgAdmin 4.
2. Crea una base local. En el equipo principal se llama `honbo`.
3. No reutilices contraseñas compartidas. Cada desarrollador configura su propia contraseña local.
4. Desde pgAdmin confirma que el servidor escucha en `localhost:5432`.

### Opción B: Docker <!-- no se usa por el momento -->

```powershell
docker compose -f compose.dev.yml up -d
```

Esta opción crea una base independiente en `localhost:5433`. Consulta [DOCKER.md](DOCKER.md).

## 4. Configurar el backend

```powershell
cd backend
Copy-Item .env.example .env
pnpm install --frozen-lockfile
```

Edita `.env`:

```dotenv
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://postgres:TU_CLAVE@localhost:5432/honbo
DATABASE_SSL=false
APP_ORIGIN=http://localhost:5173
TRUST_PROXY=false
MAIL_MODE=log
```

Genera la clave de MFA:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Copia el resultado en `MFA_ENCRYPTION_KEY`. Nunca publiques `.env`.

Aplica el esquema y ejecuta pruebas:

```powershell
pnpm migrate
pnpm test
pnpm test:integration
pnpm dev
```

La API queda en `http://localhost:3000`. Verifica `http://localhost:3000/api/v1/health`.

## 5. Configurar el frontend

En otra terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Abre `http://localhost:5173`. Vite envía las solicitudes `/api` al puerto 3000.

Antes de entregar cambios:

```powershell
npm run lint
npm run build
```

## 6. Correo durante desarrollo

Con `MAIL_MODE=log`, los enlaces de confirmación y recuperación aparecen en la terminal del backend.
Copia el enlace completo y ábrelo en el navegador.

Para Gmail:

1. Activa la verificación en dos pasos de Google.
2. Crea una contraseña de aplicación.
3. Configura `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587` y
   `SMTP_SECURE=false`.
4. Cambia `MAIL_MODE=smtp`.
5. Ejecuta `pnpm mail:verify`.

Consulta [EMAIL_SETUP.md](EMAIL_SETUP.md) para el procedimiento completo.

## 7. Flujo que debe probarse

1. Seleccionar tipo de usuario.
2. Completar los datos de cuenta.
3. Para estudiante: registrar la referencia de acreditación y elegir intención de plan.
4. Para egresado: elegir Gratis o Inicio Profesional.
5. Para mentor y organización: completar la incorporación inicial sin plan de talento.
6. Recibir el correo.
7. Abrir exclusivamente el botón del correo.
8. Llegar al dashboard correspondiente.

No debe existir un botón dentro de la aplicación que permita declarar manualmente que el correo fue
confirmado.

## 8. Estructura

```text
proyecto/
├── backend/
│   ├── migrations/
│   ├── src/config/
│   ├── src/controllers/
│   ├── src/middlewares/
│   ├── src/models/
│   ├── src/routes/
│   ├── src/services/
│   ├── src/utils/
│   ├── src/app.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── lib/
│       └── App.jsx
├── shared/
└── postman/
```

`App.jsx` elige páginas completas. Cada página compone sus componentes desde `src/pages`. Los
estilos de componentes usan CSS Modules.

## 9. Forma de trabajo con Git

```powershell
git switch main
git pull
git switch -c feature/nombre-del-cambio
```

Después de desarrollar:

```powershell
git status
git add proyecto
git commit -m "Describe el cambio"
git push -u origin feature/nombre-del-cambio
```

Abre un Pull Request contra `main`. GitHub Actions ejecutará migraciones, pruebas, lint, compilación
y auditorías.

## 10. Problemas frecuentes

- **`pnpm no se reconoce`**: activa Corepack como se explica en la sección 2.
- **`npm-cli.js no encontrado`**: repara o reinstala Node.js 22 LTS y elimina instalaciones globales
  incompletas de npm.
- **404 en `http://localhost:3000/`**: la API principal responde ahí, pero las operaciones están
  bajo `/api/v1`.
- **404 después de agregar una ruta**: reinicia el proceso backend.
- **Error de conexión PostgreSQL**: revisa puerto, base, usuario y contraseña de `DATABASE_URL`.
- **No llega el correo**: usa primero `MAIL_MODE=log`; para Gmail se requiere contraseña de
  aplicación.
