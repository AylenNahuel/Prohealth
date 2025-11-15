# ProHealth API

Backend en Node.js + Express que sirve como API para el panel administrativo y el formulario público del proyecto. Utiliza MySQL como base de datos principal (podés administrarla con MySQL Workbench).

## Requisitos

- Node.js 18+
- MySQL 8 (local, Docker o instancia remota)

## Configuración rápida

1. Clonar variables de entorno:

   ```bash
   cp .env.example .env
   ```

2. Editar `.env` con las credenciales (host, puerto, usuario, contraseña) de tu instancia MySQL.

3. Crear base y tablas ejecutando los scripts en `db/schema.sql` desde MySQL Workbench, `mysql` o `mysqlsh`.
   ```bash
   mysql -u root -p < db/schema.sql
   mysql -u root -p < db/seed.sql
   ```

4. Sembrar datos de ejemplo con `db/seed.sql` (credenciales `admin@demo.com / Admin123!`).

5. Instalar dependencias y arrancar en modo dev:

   ```bash
   npm install
   npm run dev
   ```

   El servidor quedará escuchando en `http://localhost:4000`.

## Scripts

| Comando         | Descripción                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Arranca con nodemon y recarga en vivo |
| `npm start`     | Arranca el servidor en modo producción |

## Endpoints principales

| Método | Ruta                         | Descripción                              |
| ------ | ---------------------------- | ---------------------------------------- |
| POST   | `/api/auth/login`            | Login de administrador (devuelve JWT).   |
| GET    | `/api/insurances`            | Listado público de obras sociales.       |
| POST   | `/api/insurances`            | Alta de obra social (requiere JWT).      |
| PUT    | `/api/insurances/:id`        | Edición (requiere JWT).                  |
| DELETE | `/api/insurances/:id`        | Baja (requiere JWT).                     |
| GET    | `/api/appointments`          | Listado/filtrado de turnos.              |
| POST   | `/api/appointments`          | Reserva pública de turno.                |
| PATCH  | `/api/appointments/:id/status` | Actualiza estado (Solicitada/Confirmada/Cancelada). |
| DELETE | `/api/appointments/:id`      | Elimina un turno (requiere JWT).         |

Autenticación: enviar header `Authorization: Bearer <token>`.

## Estructura de carpetas

```
server/
├── db/               # Scripts SQL (schema + seeds)
├── src/
│   ├── config/       # env + conexión MySQL
│   ├── controllers/  # Orquestación de rutas
│   ├── middleware/   # Auth, errores, validaciones
│   ├── routes/       # Definición de endpoints
│   ├── services/     # Acceso a datos / reglas de negocio
│   └── utils/        # Helpers (JWT, asyncHandler, etc.)
```

## Próximos pasos sugeridos

- Agregar tests automatizados para servicios y rutas.
- Integrar un cliente de correo (SendGrid, SMTP) para notificaciones reales.
- Generar migraciones automatizadas (por ej. con `sequelize` o `knex`).
