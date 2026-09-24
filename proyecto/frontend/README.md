# Frontend de Hongus

## Desarrollo

`npm run dev` inicia Vite con recarga automática. Este modo entrega los archivos de `src` al
navegador para facilitar la depuración; úsalo solo localmente.

## Vista de producción

`npm run start` compila y sirve `dist` en `http://127.0.0.1:4173/`. También puedes ejecutar
`npm run build` y después `npm run preview`. La compilación minimiza el JavaScript y no genera mapas
de código fuente.

El navegador siempre recibe el HTML, CSS y JavaScript necesarios para mostrar la página, por lo que
una persona puede inspeccionar el código entregado. CSS Modules y la minificación no lo hacen
secreto. Las credenciales, claves y reglas de negocio sensibles deben permanecer en el backend y no
importarse en `src` ni guardarse en variables `VITE_*`.

## Organización

- `src/App.jsx`: renderiza páginas completas.
- `src/pages/`: compone los componentes de cada página.
- `src/components/landing/`: componentes de la landing y sus CSS Modules.
