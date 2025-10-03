# TPO � Sistema de Turnos M�dicos

Aplicaci�n frontend construida en React para gestionar reservas de turnos de un consultorio m�dico. Incluye landing p�blica, turnera interactiva, formulario de solicitud, login demo, panel administrativo y CRUD de obras sociales con persistencia en LocalStorage.

## Stack
- React 18 (Create React App)
- Material UI 5
- React Router DOM 6
- Dayjs
- Context + hooks personalizados (notificaciones y obras sociales)

## Instalaci�n
`ash
npm install
npm start
`
La app corre en http://localhost:3000.

## Estructura de carpetas
`
/src
  /components        # Navbar, Hero, Turnera, di�logos, NotificationProvider, etc.
  /pages             # Home, Login, AdminDashboard, AdminAppointments, AdminInsurances�
  /hooks             # useInsurances, useNotifications
  /mocks             # citas y obras sociales de ejemplo
  /utils             # calendario, helpers de storage
  /theme             # tema global de MUI
  App.js / index.js
`

## Funcionalidades entregadas
- Landing completa con secciones Hero, Servicios, Bio, Obras Sociales y Contacto.
- Turnera interactiva (14 d�as h�biles, intervalos de 30 minutos) + formulario validado con mock de turnos ocupados.
- Login demo (admin@demo.com / Admin123!).
- Panel administrativo con dashboard, listado de citas y acciones de confirmaci�n.
- CRUD de obras sociales en memoria con persistencia en LocalStorage y reflejado en el formulario p�blico.
- Sistema de notificaciones mock (Snackbars) para creaci�n y confirmaci�n de turnos.

## Pr�ximos pasos
- Integrar backend Node/Express con base de datos (SQL/NoSQL).
- Persistir citas reales, confirmar turnos v�a API y enviar correos con nodemailer.
- Implementar autenticaci�n real y manejo de sesiones.
- A�adir reportes y m�tricas ampliadas en el panel.

## Autores / Facultad
Trabajo Pr�ctico Final � Interactivas
Universidad / C�tedra: [Completar informaci�n institucional]

## Checklist de la entrega
- [x] Compila sin errores.
- [x] Rutas p�blicas/privadas y guards funcionando.
- [x] Turnera operativa (14 d�as h�biles, cada 30 minutos).
- [x] Mock de turnos ocupados integrado.
- [x] CRUD de obras sociales activo y visible en el selector del formulario.
- [x] Snackbars y notificaciones alineadas al dise�o.
