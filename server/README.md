# ProHealth API – Backend

## Datos de la entrega

- **Materia:** Aplicaciones Interactivas  
- **Docentes:** María Paula Sarasa y Francisco Fares  
- **Grupo:** 2  
- **Integrantes:**
  - Martina Castro – Legajo 1167379  
  - Aylen Nahuel – Legajo 1135727  

---

## Descripción

API REST desarrollada en **Node.js + Express** que funciona como backend del sistema de turnos médicos **ProHealth**.  
Expone endpoints para:

- Autenticación de administrador.
- Gestión de obras sociales (CRUD).
- Gestión de turnos (alta, listado, cambio de estado, eliminación).

La persistencia se realiza en **MySQL**.

---

## Requisitos

- Node.js 18+  
- npm  
- MySQL 8 (local o Docker)

---

## 1. Configuración de variables de entorno

Desde la carpeta `server/`:

```bash
cp .env.example .env
```

Luego editar `server/.env` con los datos de tu base de datos. Ejemplo:

```env
PORT=4000
APP_URL=http://localhost:3000

JWT_SECRET=un-super-secreto-largo
JWT_EXPIRATION=1d

DB_SERVER=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=martucastro
DB_NAME=ProHealth
DB_SSL=false
```

> Ajustar `DB_USER` y `DB_PASSWORD` si tu usuario de MySQL es distinto.

---

## 2. Inicializar la base de datos

Desde la carpeta `server/`, en CMD o PowerShell:

```bash
# Crear base y tablas
mysql -u root -pmartucastro < db/schema.sql

# Cargar datos de ejemplo (obras sociales, admin, turnos)
mysql -u root -pmartucastro < db/seed.sql
```

Esto crea la base `ProHealth` con:

- Obras sociales preconfiguradas (OSDE, IOMA, Galeno, Medife, OMINT, Swiss Medical).
- Usuario administrador demo:
  - **Email:** `admin@demo.com`
  - **Password:** `Admin123!`
- Algunos turnos de ejemplo.

---

## 3. Instalación y ejecución

Desde `server/`:

```bash
npm install

# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

La API queda escuchando en: `http://localhost:4000/api`

---

## 4. Scripts disponibles

| Comando       | Descripción                              |
| ------------- | ---------------------------------------- |
| `npm run dev` | Arranca el servidor con nodemon          |
| `npm start`   | Arranca el servidor en modo producción   |

---

## 5. Endpoints principales

Base: `http://localhost:4000/api`

### Auth

- `POST /auth/login`  
  Login de administrador. Devuelve un JWT que se usa en el panel.

### Obras sociales

- `GET /insurances`  
  Listado público de obras sociales.

- `POST /insurances` *(requiere JWT)*  
  Alta de obra social.

- `PUT /insurances/:id` *(requiere JWT)*  
  Edición de obra social existente.

- `DELETE /insurances/:id` *(requiere JWT)*  
  Eliminación de obra social.

### Turnos

- `GET /appointments`  
  Listado y filtrado de turnos.

- `POST /appointments`  
  Reserva pública de turno desde el formulario.

- `PATCH /appointments/:id/status` *(requiere JWT)*  
  Actualiza el estado del turno (Solicitada, Confirmada, Cancelada).

- `DELETE /appointments/:id` *(requiere JWT)*  
  Elimina un turno.

**Autenticación:**  
Para los endpoints protegidos, enviar el header:

```http
Authorization: Bearer <token>
```

---

## 6. Estructura de carpetas (backend)

```text
server/
  db/               # Scripts SQL (schema + seeds)
  src/
    config/         # env, conexión MySQL
    controllers/    # Controladores de cada recurso
    middleware/     # Auth, validaciones, manejo de errores
    routes/         # Definición de rutas /api
    services/       # Lógica de negocio / acceso a datos
    utils/          # Helpers (JWT, asyncHandler, etc.)
```

---

## 7. Checklist del backend

- [x] API en Node.js + Express.
- [x] Conexión a MySQL con pool de conexiones.
- [x] Scripts SQL para crear y poblar la base (`schema.sql`, `seed.sql`).
- [x] Autenticación de administrador con JWT.
- [x] Endpoints para obras sociales (CRUD).
- [x] Endpoints para turnos (alta, listado, cambio de estado, eliminación).
- [x] Manejo básico de errores y validaciones.

---

## 8. Esquema de base de datos

Los scripts SQL se encuentran en:

- `server/db/schema.sql`  → crea la base de datos y las tablas.
- `server/db/seed.sql`    → inserta datos de ejemplo.

### Tablas

**AdminUsers**

- `Id` INT PK AUTO_INCREMENT  
- `FullName` VARCHAR(120) NOT NULL  
- `Email` VARCHAR(120) NOT NULL UNIQUE  
- `PasswordHash` VARCHAR(255) NOT NULL  
- `Role` VARCHAR(30) NOT NULL DEFAULT 'ADMIN'  
- `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  

**Insurances**

- `Id` VARCHAR(30) PK  
- `Nombre` VARCHAR(120) NOT NULL  
- `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  
- `UpdatedAt` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP  

**Appointments**

- `Id` INT PK AUTO_INCREMENT  
- `PatientName` VARCHAR(120) NOT NULL  
- `Phone` VARCHAR(50) NOT NULL  
- `Email` VARCHAR(180) NOT NULL  
- `InsuranceId` VARCHAR(30) NOT NULL FK → `Insurances(Id)`  
- `SlotDate` DATETIME NOT NULL  
- `Notes` VARCHAR(500) NULL  
- `Status` VARCHAR(20) NOT NULL DEFAULT 'SOLICITADA'  
- `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP  
- `UpdatedAt` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP  

Índices:

- `IX_Appointments_SlotDate` sobre `Appointments(SlotDate)`.

## 9. Colección de Postman
La documentación interactiva de la API se encuentra en:

https://documenter.getpostman.com/view/50089474/2sB3dLTBRT
