# Flujo de cuenta, verificación y workspace

## Regla central

La cuenta no obtiene sesión hasta consumir el token de un solo uso enviado por correo. La interfaz
no puede sustituir esa comprobación.

## Estudiante

Tipo de usuario → datos de cuenta → datos de acreditación → intención de plan → correo →
confirmación → dashboard con Gratis mientras se revisa.

La intención Estudiante no realiza cargos. El checkout se habilita cuando una revisión autorizada
aprueba la acreditación. Un rechazo o una solicitud de corrección conserva el acceso Gratis.

## Egresado o profesional sin experiencia

Tipo de usuario → datos de cuenta → Gratis o Inicio Profesional → correo → confirmación → dashboard.

Elegir Inicio Profesional expresa intención. El cobro se inicia después de confirmar el correo y
revisar el resumen.

## Mentor

Tipo de usuario → datos de cuenta → correo → confirmación → workspace de mentor con incorporación
pendiente.

No recibe planes de talento ni permisos de mentor automáticamente.

## Empresa o institución

Tipo de usuario → datos de cuenta → correo → confirmación → workspace de organización con
incorporación pendiente.

No recibe planes de talento. La organización debe completar su información y revisión.

## Estados técnicos

- `pending_onboarding`: cuenta creada sin correo enviado hasta cerrar los pasos previos.
- `email pending`: incorporación cerrada y enlace enviado.
- `email verified`: token válido consumido y sesión creada.
- `accreditation pending`: estudiante conserva Gratis.
- `subscription active`: pago confirmado por servidor y periodo creado una sola vez.
