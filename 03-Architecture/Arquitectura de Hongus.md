# Arquitectura de Hongus

Versión: 1.1. Estado: estructura de una carpeta raíz con backend/ y front/ confirmada por el fundador; diseño técnico propuesto para revisión de los líderes. No equivale a aprobación de proveedores ni implementación. Las reglas confirmadas de producto prevalecen sobre esta propuesta.

## Objetivo
Construir una plataforma web para México, desde 18 años, con apertura pública entre julio y octubre de 2027. Cumplir todos los beneficios de los planes antes de cobrarlos. Dos líderes supervisan y programan con colaboradores por reclutar; horarios flexibles, sin Scrum. Presupuesto inicial asignado $0; producción necesita costos y responsables definidos.

## Estructura elegida para la propuesta
**Monolito modular:** una API desplegable, con reglas separadas por módulo y una base PostgreSQL. Un proceso worker del mismo código ejecuta tareas durables. Una aplicación web muestra vistas distintas según permisos. No crear una aplicación independiente por cada tipo de usuario.

```text
Navegador: web pública y área autenticada por rol
                  | HTTPS, mismo origen preferido
                  v
           Entrada web / proxy
             |             |
       Archivos web     API /api/v1
                           |
        Servicios de módulos y autorización
             |             |              |
        PostgreSQL    Archivos privados   Adaptadores externos
             |                               pagos / correo / IA
       Tareas y outbox
             |
          Worker -----> generación CV y documentos / notificaciones
```

El panel administrativo es una vista protegida, no un registro público. Elegir tipo de usuario solo expresa intención; revisión y permisos conceden capacidades. Mentores y organizaciones siguen su incorporación propia, sin asignarles planes de talento automáticamente.

## Módulos y límites
| Módulo | Posee | Ofrece a los demás |
| --- | --- | --- |
| Identidad | Cuenta, sesión, permisos de plataforma | Identidad autenticada y autorización |
| Talento | Perfil, acreditación académica | Elegibilidad y datos autorizados del perfil |
| Organizaciones | Organización y membresías | Permiso vigente para actuar por una entidad |
| Oportunidades | Publicaciones, requisitos, revisión verde | Disponibilidad y requisitos para candidaturas |
| Candidaturas | Envíos, versiones y transiciones | Seguimiento y resultados confirmados |
| Suscripciones | Plan versionado, periodo, derechos y cupos | Derecho vigente para cada acción |
| Pagos | Órdenes, transacciones, devoluciones y reparto | Confirmación conciliada, sin conceder roles |
| Mentorías | Agenda, reservas, sesiones y asistencia | Consumo o devolución de cupo según política |
| CV y recursos | CV, versiones, guías y solicitudes IA | Borradores revisables por su titular |
| Verify | Logros, confirmantes y documentos versionados | Evidencia verificable con exposición limitada |
| Relaciones | Contactos, asuntos, participantes y mensajes | Intercambio autorizado por propósito |
| Operación | Reclamaciones, auditoría y tareas | Soporte, notificaciones y acciones trazables |

Los módulos no escriben directamente tablas de otros módulos; usan servicios públicos internos. Lecturas cruzadas para reportes requieren consultas autorizadas o proyecciones explícitas. Compartir una base facilita transacciones, no elimina límites. Validar entradas en servidor y probar reglas sin depender de la interfaz.

## Stack propuesto
| Capa | Propuesta | Motivo y límite |
| --- | --- | --- |
| Web autenticada | React con Vite, JavaScript y CSS Modules | Continuidad con mice.2; routing, datos remotos y accesibilidad se diseñan explícitamente |
| Web pública | Misma base visual, páginas de presentación prerenderizadas cuando sea necesario | Descubrimiento público y metadatos requieren estrategia propia; una SPA no resuelve SEO por sí sola |
| API y worker | Node.js LTS con Express, JavaScript | Experiencia observada; elegir una línea soportada al implementar y reevaluar antes de 2027 |
| Base | PostgreSQL y migraciones SQL versionadas; acceso parametrizado | Integridad de pagos, periodos y reservas; sin elegir ORM obligatorio |
| Archivos | Almacenamiento de objetos privado, proveedor por definir | Evidencias y PDFs fuera del directorio público y de la base |
| Pruebas | Pruebas de reglas, integración con PostgreSQL y Playwright para recorridos | Reutilizar prácticas del equipo; pruebas de API simulada no sustituyen integración real |
| Entrega | GitHub Actions propuesto y despliegue controlado | Revisión por otra persona; no crea repositorios ni workflows en esta fase |

No fijar versiones futuras ni asumir servicios gratuitos suficientes. TypeScript puede evaluarse con los líderes, pero no se presupone experiencia ni se agrega como requisito inicial. Redis, microservicios, Kubernetes, matching avanzado y app móvil nativa quedan fuera de esta v1; reconsiderar solo por necesidad medida.

## Organización propuesta del repositorio de aplicación
Todo el proyecto de aplicación estará en una carpeta raíz `hongus/`, con dos carpetas principales: `backend/` y `front/`. Un único repositorio Git permite revisar cambios relacionados de ambas partes juntos. La bóveda actual documenta el diseño; esta actualización no crea ni mueve todavía el código de aplicación.
```text
hongus/
  backend/
    src/
      app.js                  configuración HTTP
      server.js               entrada de la API
      worker.js               entrada de tareas en segundo plano
      modules/                identidad, talento, pagos, mentorías, etc.
      infrastructure/         base, archivos, correo y adaptadores externos
      jobs/                   consumidores de tareas y reintentos
      config/                 configuración validada del servidor
    db/migrations/            cambios incrementales de PostgreSQL
    contracts/openapi.yaml    contrato de la API
    tests/                    reglas e integración con base de pruebas
    package.json
    .env.example              nombres de variables sin secretos
  front/
    src/
      app/                    navegación y composición de vistas
      features/               registro, perfil, candidaturas, etc.
      components/             componentes visuales compartidos
      services/               cliente HTTP de la API
      styles/                 identidad visual y estilos
    public/                   solo recursos públicos
    tests/                    componentes y recorridos de navegador
    package.json
    .env.example              solo configuración pública del cliente
  .github/workflows/          verificaciones de ambas partes
  .gitignore
  README.md                   cómo preparar y ejecutar el proyecto
```
Cada parte tiene dependencias y comandos propios. La API y el worker usan el mismo paquete backend y los mismos servicios de negocio, aunque se ejecuten como procesos distintos. Las migraciones y contratos pertenecen al backend. El front consume la API por HTTP; no importa servicios internos del backend ni accede a PostgreSQL.

No guardar documentos de usuarios en `front/public/`, archivos .env reales en Git ni claves privadas en variables del frontend. Un repositorio único no obliga a alojar web, API, worker y base en la misma máquina. Probar y desplegar cada componente según sus necesidades.

### Organización dentro de un módulo
Ejemplo propuesto para `backend/src/modules/subscriptions/`:
```text
routes.js        rutas y conexión con middlewares
controller.js    entrada y salida HTTP
schemas.js       validación de datos recibidos
service.js       casos de uso y reglas de suscripción
repository.js    consultas parametrizadas de su módulo
```
El recorrido es petición → autorización y validación → controlador → servicio → persistencia. Mantener transacciones de negocio en el servicio con una unidad de trabajo compartida cuando participen varios módulos. El worker invoca servicios, sin simular peticiones HTTP internas. Crear archivos según necesidad real; no llenar carpetas de abstracciones vacías.

## Qué tipo de arquitectura es
La solución combina **cliente-servidor**, **backend de monolito modular** y **capas dentro de los módulos**. Cliente-servidor separa la interfaz del procesamiento y los datos. Monolito modular significa que el backend es una aplicación con responsabilidades internas delimitadas; las capas separan transporte HTTP, reglas y persistencia.

La carpeta raíz y el único repositorio describen la organización del código, habitualmente llamada monorepo. Eso no convierte por sí solo una aplicación en monolito o microservicios. El tipo de arquitectura depende de cómo colaboran y se despliegan sus componentes.

## Por qué nos conviene
- **Coordinación:** dos líderes pueden revisar en un mismo cambio la pantalla, su contrato y el backend; cada ticket puede entregar un recorrido completo.
- **Aprendizaje:** los colaboradores tienen una separación visible entre interfaz y servidor, con módulos que acotan el trabajo.
- **Operación inicial:** una API y un worker del mismo código reducen la cantidad de servicios y despliegues que mantener. Esto reduce complejidad, no garantiza costo cero.
- **Integridad:** pagos, beneficios y reservas pueden coordinarse con transacciones de la misma base y límites claros entre servicios.
- **Evolución:** nuevas funciones se agregan al módulo adecuado. Si posteriormente un área necesita escalar por separado, se evalúa extraerla con su contrato y datos definidos.

**Compromisos:** cambios de backend comparten publicación y pueden afectar varias funciones; se requieren pruebas y revisión de dependencias. Una base compartida necesita disciplina para no mezclar responsabilidades. Separar un módulo en servicio futuro tendrá trabajo de migración; no será automático. Horarios flexibles y ausencia de Scrum no alteran estos límites: se coordina por tickets y revisiones.

## Documentos de implementación
- [[Modelo de dominio]]: entidades, relaciones, estados e invariantes.
- [[Seguridad y confianza]]: matriz de acceso y evidencias privadas.
- [[Contratos y procesos criticos]]: API, pagos, reservas, Verify e IA.
- [[Operacion y entornos]]: despliegue, pruebas, incidentes y costos.
- [[Decisiones tecnicas y evolucion]]: elección, alternativas y cambios futuros.
- [[Registro validacion y activacion]]: primer recorrido de producto.

## Fundamento técnico consultado
React documenta que iniciar desde una herramienta como Vite requiere resolver routing, datos y otras necesidades; la propuesta adopta ese costo por continuidad del equipo: [React](https://react.dev/learn/build-a-react-app-from-scratch).
Producción debe usar una línea Node.js Active LTS o Maintenance LTS: [Node.js](https://nodejs.org/en/about/previous-releases).
PostgreSQL documenta bloqueo de filas para coordinar actualizaciones concurrentes: [PostgreSQL](https://www.postgresql.org/docs/18/explicit-locking.html). Las transacciones se mantendrán breves, sin llamadas externas dentro del bloqueo.


## Implementación disponible · 24 de septiembre de 2026

La primera implementación vive en `proyecto/` como frontend React/Vite, API Node.js/Express y PostgreSQL. `backend/src/app.js` compone middleware y rutas; `backend/server.js` valida la conexión, ejecuta tareas operativas e inicia el puerto. Las migraciones 001 a 007 cubren cuentas, tokens, sesiones, MFA, consentimiento, planes, órdenes, suscripciones, acreditación e incorporación. El estado detallado está en [[Estado actual del desarrollo]].

Las capas actuales del backend son `config`, `controllers`, `middlewares`, `models`, `routes`, `services` y `utils`. En el frontend, `App.jsx` selecciona páginas completas; cada página compone componentes y sus estilos se mantienen con CSS Modules. La integración de pagos continúa simulada y no representa un proveedor productivo.
