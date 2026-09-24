# Documentos legales de Hongus

Las páginas públicas están en `/terminos-y-condiciones` y `/aviso-de-privacidad`. El contenido
fuente compartido está en `shared/legal-documents.json`; la copia de la versión actual está en
`shared/archive/2026-09-18.json`.

Responsable informado por el fundador: **Luis Orozco Rovelo**, Salamanca 248, Col. Praderas de San
Juan, Juárez, Nuevo León, México. Contacto: **legalidad@hongus.com**.

## Alcance de esta versión

Describe únicamente la landing y la cuenta actual: registro para mayores de edad, correo, sesiones,
recuperación y MFA. Los planes, pagos, candidaturas, documentos académicos, mentorías, cursos y
certificaciones están previstos, pero aún no funcionan en este proyecto. Antes de activarlos deben
definirse condiciones comerciales, destinatarios de datos, plazos de conservación y cambios al
aviso.

El registro muestra un resumen y enlaces a ambos documentos. El backend guarda fecha, versión y
SHA-256 del contenido de cada uno en la cuenta. El archivo de la versión aceptada debe conservarse
sin cambios cuando se publique una versión nueva. La depuración periódica de registros técnicos se
implementa en `backend/src/services/cleanup.service.js`.

## Revisión antes de producción

1. Confirmar que el domicilio y el correo de contacto están correctos y que `legalidad@hongus.com`
   recibe solicitudes.
2. Someter los textos a revisión de una persona profesional en derecho mexicano y privacidad. En
   particular, validar identidad del responsable, procedimiento ARCO, relación con proveedores y
   política de respaldos.
3. Definir el proceso humano para responder solicitudes ARCO y cierre de cuenta; hoy el canal es el
   correo, sin panel administrativo de privacidad.
4. Al agregar funciones, actualizar `shared/legal-documents.json`, aumentar la versión y fecha,
   guardar una copia inmutable en `shared/archive/` y ejecutar las pruebas antes de desplegar. No
   reutilizar una versión anterior para un texto diferente.

## Base normativa consultada

- [Ley Federal de Protección de Datos Personales en Posesión de los Particulares, texto vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf),
  especialmente artículos 14 a 16 sobre aviso y 27 a 31 sobre derechos ARCO.
- [Ley Federal de Protección al Consumidor, texto vigente](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPC.pdf),
  artículo 76 Bis para futuras transacciones electrónicas. Los cobros todavía no están habilitados.

Este documento registra el alcance y las decisiones pendientes; no sustituye la revisión profesional
de los textos públicos.
