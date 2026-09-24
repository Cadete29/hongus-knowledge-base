# Docker desde cero con Hongus

## Qué estás viendo en este repositorio

Una **imagen** es el paquete listo para ejecutar; `postgres:17-alpine` es la imagen de PostgreSQL
usada aquí. Un **contenedor** es una instancia de esa imagen en ejecución. **Compose** lee
`compose.dev.yml` y crea el contenedor con su configuración. Un **volumen** conserva los datos de
PostgreSQL aunque detengas o recrees el contenedor.

Hongus funciona hoy con el PostgreSQL que ya instalaste y administras desde pgAdmin. El archivo
`compose.dev.yml` es un laboratorio opcional: crea una base distinta llamada `hongus`. Expone el
puerto **5433** para no competir con tu PostgreSQL del puerto **5432**, donde está `honbo`.

## Primera práctica

1. Instala
   [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/) y
   ábrelo. La documentación oficial explica los requisitos y la opción WSL 2.
2. En PowerShell, desde la carpeta `proyecto`, comprueba `docker --version` y
   `docker compose version`.
3. Ejecuta `docker compose -f compose.dev.yml up -d` para iniciar la base de práctica.
4. Usa `docker compose -f compose.dev.yml ps` para ver el contenedor y
   `docker compose -f compose.dev.yml logs postgres` para leer sus mensajes.
5. En pgAdmin, crea una conexión **nueva** a `localhost`, puerto `5433`, base `hongus`, usuario
   `hongus`, contraseña `hongus`. Son credenciales de desarrollo del archivo Compose.
6. Ejecuta `docker compose -f compose.dev.yml down` cuando termines. El volumen `hongus_pg` conserva
   los datos para la siguiente práctica.

Para conectar el backend a esa base de práctica, cambia temporalmente solo `DATABASE_URL` en
`backend/.env` a `postgres://hongus:hongus@localhost:5433/hongus`, ejecuta `pnpm migrate` en
`backend/` y vuelve a poner la URL de `honbo` al finalizar. No mezcles datos de ambas bases.

## Cómo leer `compose.dev.yml`

| Campo               | En este proyecto                                                         |
| ------------------- | ------------------------------------------------------------------------ |
| `services.postgres` | Define el contenedor de base de datos.                                   |
| `image`             | Usa PostgreSQL 17 empaquetado.                                           |
| `environment`       | Crea la base y el usuario de práctica.                                   |
| `ports`             | Conecta `localhost:5433` de Windows con el puerto `5432` del contenedor. |
| `volumes`           | Guarda los archivos de datos fuera de la vida del contenedor.            |
| `healthcheck`       | Comprueba si PostgreSQL acepta conexiones.                               |

Para aprender más:
[conceptos de contenedores](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/),
[conceptos de imágenes](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
y [guía de Compose](https://docs.docker.com/compose/gettingstarted/).
