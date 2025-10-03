# ProHealth — Documentación completa

Aplicación React para gestión de turnos médicos con landing pública, formulario de reserva, autenticación demo y panel administrativo (citas y obras sociales). La app funciona 100% con mocks/localStorage hasta integrar backend.

## Stack y dependencias
- React 18 (Create React App / react-scripts)
- React Router DOM 6
- Material UI 5 + Icons
- Dayjs (fechas)
- Context/hook propio para notificaciones

Scripts NPM:
- `npm start`: dev server en http://localhost:3000
- `npm test`: test runner
- `npm run build`: build de producción

## Estructura del proyecto
```
src/
  components/
    AdminLayout.jsx            # Layout del área admin (AppBar + Drawer)
    AppointmentForm2.jsx       # Form de reserva (público) usando mocks
    AuthCard.jsx               # Card para login
    ConfirmDelete.jsx          # Diálogo genérico de confirmación
    InsuranceDialog.jsx        # Alta/edición de obra social con validaciones
    NotificationProvider.jsx   # Contexto + Snackbar global
    Turnera.jsx                # Selector de turnos (slots)

  hooks/
    useInsurances.js           # CRUD de obras sociales + persistencia localStorage
    useNotifications.js        # Hook para disparar notificaciones globales

  mocks/
    appointments.data.js       # 23 turnos mock + OCCUPIED_APPOINTMENTS
    insurances.data.js         # Obras sociales iniciales (OSDE, Swiss, Galeno, Medifé)

  pages/
    Home.jsx                   # Landing (secciones públicas)
    AppointmentsPage.jsx       # Contenedor del formulario de reserva
    Login.jsx                  # Acceso demo
    AdminAppointments.jsx      # Gestión de citas (tabla + acciones)
    AdminDashboard2.jsx        # Dashboard admin (métricas y próximos turnos)
    AdminInsurances2.jsx       # CRUD de obras sociales

  utils/
    storage.js                 # getItem/setItem seguros sobre localStorage

  theme/
    theme.js                   # Tema MUI + paleta/tipografías

  App.js                       # Rutas y layouts
  index.js                     # Bootstrap de la app
```

## Ruteo y layouts
- Público (`PublicLayout`): `/`, `/services`, `/insurances`, `/contact`, `/appointments`.
- Login: `/login`.
- Admin protegido (`ProtectedRoute` + `AdminLayout`):
  - `/admin` → Dashboard
  - `/admin/appointments` → Gestión de Citas
  - `/admin/insurances` → Obras Sociales

`ProtectedRoute` permite acceso si `localStorage.getItem('auth') === 'true'`, en caso contrario redirige a `/login` preservando `state.from`.

## Autenticación (demo)
- Credenciales válidas:
  - Email: `admin@demo.com`
  - Password: `Admin123!`
- En `Login.jsx` se valida contra constantes. Al éxito, se guarda `auth=true` en `localStorage` y se redirige.

## Notificaciones
`NotificationProvider` expone `showNotification(message, severity)` y renderiza `Snackbar` global (esquina inferior derecha).

## Datos y persistencia
- Citas: `mocks/appointments.data.js`
  - Estructura: `{ id, nombre, telefono, email, obra, slotISO, estado: 'SOLICITADA'|'CONFIRMADA' }`
  - `OCCUPIED_APPOINTMENTS`: lista de `slotISO` confirmados (para la turnera)
- Obras sociales: `mocks/insurances.data.js` + `hooks/useInsurances.js`
  - Estado inicial: `[{id:'osde', nombre:'OSDE'}, {id:'swiss', nombre:'Swiss Medical'}, {id:'galeno', nombre:'Galeno'}, {id:'medife', nombre:'Medifé'}]`
  - Persistencia en `localStorage` bajo key `insurances` (vía `utils/storage.js`)

## Páginas clave y funcionalidades

### Reserva de turnos (público)
- Componente: `components/AppointmentForm2.jsx` (usado en `pages/AppointmentsPage.jsx`).
- Selección de slot con `Turnera` (ocupa `OCCUPIED_APPOINTMENTS`).
- Validaciones: nombre (min 3), teléfono (numérico, min 8), email válido, obra social seleccionada, slot válido futuro.
- Al enviar: muestra `showNotification('Turno solicitado...', 'success')` y limpia el formulario.
- Si no hay obras sociales en la lista, el `<Select>` se deshabilita y se muestra `Alert`.

### Panel Admin

1) Dashboard (`pages/AdminDashboard2.jsx`)
- Métricas: solicitadas/confirmadas de la semana y próximos turnos (hoy y próximos 5 por fecha), calculadas desde mocks.
- Tabla de próximos turnos con fecha formateada `DD/MM/YYYY HH:mm`.

2) Gestión de Citas (`pages/AdminAppointments.jsx`)
- Tabla MUI con columnas: `ID | Paciente | Teléfono | Email | Obra Social | Fecha/Hora | Estado | Acciones`.
- Búsqueda por texto (nombre/email), orden por Fecha/Hora asc/desc, paginación (10 por página).
- Chip de estado (gris: SOLICITADA, verde: CONFIRMADA).
- Acciones: Ver detalle (Dialog) y Confirmar (cambia estado a CONFIRMADA y dispara `showNotification(...)`).
- Responsive: en mobile las acciones se muestran como `IconButton`.

3) Obras Sociales (`pages/AdminInsurances2.jsx`)
- Lista con columnas: `ID (slug) | Nombre | Acciones`.
- Búsqueda por nombre/ID, botón “Nueva obra social”.
- `InsuranceDialog` (alta/edición):
  - Campos: `id` (min 2, sin espacios, requerido, único) y `nombre` (min 3, requerido).
  - En edición, `id` está deshabilitado; solo se edita `nombre`.
- Eliminación: dialog de confirmación `ConfirmDelete` y Snackbar de resultado.
- Persistencia inmediata vía `useInsurances` en `localStorage`.

## UI y tema
- MUI `ThemeProvider` + `CssBaseline` globales en `index.js`.
- Contenedores clave con `Paper` y `p: 3` (24px) según especificaciones.
- Diseño responsive sin overflows en mobile.

## Utilidades
- `utils/storage.js`:
  - `getItem(key, fallback)` y `setItem(key, value)` con try/catch y guardas para SSR.

## Convenciones y calidad
- Fechas con `dayjs` y formato `DD/MM/YYYY HH:mm`.
- Ruteo `react-router-dom` v6 con composición de layouts y rutas protegidas.
- Hooks con dependencias cuidadas; ESLint puede advertir sobre dependencias en `Turnera.jsx` (no bloquea build).

## Limitaciones actuales
- No hay backend: todo es mock/localStorage.
- Confirmar cita actualiza estado en memoria; no persiste en base de datos.
- Login es puramente demo con credenciales fijas.

## Roadmap de integración backend
- Endpoints sugeridos (ejemplo):
  - `GET /api/insurances` | `POST /api/insurances` | `PUT /api/insurances/:id` | `DELETE /api/insurances/:id`
  - `GET /api/appointments?from=...&to=...&q=...` | `PUT /api/appointments/:id/confirm`
- Sustituir mocks por servicios (fetch/axios) en hooks/páginas.
- Autenticación real (JWT) y middleware de rutas protegidas.

## Credenciales demo
- Email: `admin@demo.com`
- Password: `Admin123!`

## Troubleshooting
- “Unstable_Grid2” no resuelto: usar `@mui/material/Grid` (ya aplicado en el repo).
- Cambios que no se reflejan: parar dev server, borrar `node_modules/.cache` y reiniciar `npm start`.
- Problemas de login: borrar `localStorage` (`localStorage.removeItem('auth')`) y reintentar con las credenciales demo.

---
Para dudas o mejoras, abrir un issue o comentar en el repositorio del proyecto.

