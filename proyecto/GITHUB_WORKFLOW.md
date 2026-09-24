# Flujo de GitHub y pull requests

Esta guía explica cómo entregar cambios sin trabajar directamente sobre `main`. Linear asigna el
folio oficial de cada tarea, por ejemplo `HON-11`.

## Regla principal

Todo cambio debe cumplir esta secuencia:

1. Tener un ticket de Linear `HON-n`.
2. Crear una rama desde `main` actualizada.
3. Implementar y validar el cambio en esa rama.
4. Subir la rama a GitHub.
5. Abrir un pull request con el folio en el título.
6. Obtener revisión y verificaciones correctas.
7. Integrar mediante GitHub.

No se hacen commits ni `push` directamente sobre `main`.

## 1. Preparar el repositorio local

Clona el repositorio solo la primera vez:

```powershell
git clone https://github.com/Cadete29/hongus-knowledge-base.git
cd hongus-knowledge-base
```

Antes de comenzar cada ticket:

```powershell
git switch main
git pull --ff-only origin main
git status
```

`git status` debe indicar que no hay cambios pendientes. Si existen, guárdalos en un commit de su
rama o usa `git stash` antes de cambiar de rama.

## 2. Crear una rama vinculada al ticket

Formato:

```text
tipo/HON-numero-descripcion-corta
```

Tipos permitidos:

- `feature`: funcionalidad nueva.
- `fix`: corrección.
- `docs`: documentación.
- `refactor`: reorganización sin cambiar comportamiento.
- `test`: pruebas.
- `chore`: mantenimiento o configuración.

Ejemplo:

```powershell
git switch -c feature/HON-6-acreditacion-estudiantil
```

Una rama atiende un ticket. Si el trabajo descubre otro alcance, se crea otro ticket y otra rama.

## 3. Guardar los cambios

Revisa antes de confirmar:

```powershell
git status
git diff
```

Ejecuta las validaciones relacionadas con el cambio. Para el proyecto actual:

```powershell
cd proyecto/frontend
.\node_modules\.bin\eslint.cmd .
.\node_modules\.bin\vite.cmd build

cd ../backend
node --test
```

Después crea el commit con el folio:

```powershell
git add ruta/del/archivo
git commit -m "HON-6 completa acreditacion estudiantil"
```

Evita `git add .` cuando incluya archivos que no revisaste. Nunca subas `.env`, contraseñas,
tokens, respaldos de base de datos ni dependencias generadas.

## 4. Subir la rama

```powershell
git push -u origin feature/HON-6-acreditacion-estudiantil
```

Este comando publica la rama del ticket; no modifica `main`.

## 5. Crear el pull request

Título obligatorio:

```text
[HON-6] Completar acreditación estudiantil
```

El PR debe incluir:

- enlace al ticket de Linear;
- resumen del cambio;
- pasos y resultado de las pruebas;
- cambios de base de datos o variables de entorno;
- riesgos y plan de reversión;
- capturas para cambios visuales.

Mantén el PR como borrador mientras no esté listo para revisión.

## 6. Actualizar la rama sin dañar `main`

Si `main` cambió mientras trabajabas:

```powershell
git fetch origin
git rebase origin/main
```

Resuelve cada conflicto en tu rama, vuelve a ejecutar las pruebas y continúa:

```powershell
git add ruta/resuelta
git rebase --continue
git push --force-with-lease
```

`--force-with-lease` se usa únicamente en la rama del ticket después de un rebase. Nunca se usa en
`main`.

## 7. Revisión e integración

Antes de integrar:

- al menos otra persona aprueba;
- todas las conversaciones están resueltas;
- lint, pruebas y build terminan correctamente;
- el ticket y el PR están vinculados;
- las migraciones y variables nuevas están documentadas.

Usar **Squash and merge** deja un solo commit identificable en `main`. El mensaje final conserva el
folio, por ejemplo `[HON-6] Completar acreditación estudiantil (#24)`.

Después de integrar:

```powershell
git switch main
git pull --ff-only origin main
git branch -d feature/HON-6-acreditacion-estudiantil
```

El ticket pasa a terminado cuando el cambio ya está en `main` y la evidencia de validación quedó en
el PR.

## Protección recomendada para `main`

Configurar en GitHub una regla de protección con:

- pull request obligatorio;
- una aprobación como mínimo;
- verificaciones de CI obligatorias;
- conversaciones resueltas;
- rama actualizada antes de integrar;
- bloqueo de `force push` y eliminación;
- alcance también para administradores.

La implementación de esta configuración se sigue en
[HON-11](https://linear.app/hongus/issue/HON-11/proteger-main-y-establecer-ci-para-pull-requests).

## Acciones que requieren recuperación

Si alguien hizo un commit local en `main`, no debe subirlo. Crea una rama desde ese punto:

```powershell
git switch -c fix/HON-numero-descripcion
git switch main
git reset --keep origin/main
```

Antes de ejecutar `reset`, confirma que el commit está visible en la nueva rama. Si un cambio ya se
integró y debe retirarse, crea un ticket de corrección y usa `git revert` mediante otro PR.
