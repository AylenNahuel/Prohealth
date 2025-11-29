# ProHealth – Sistema de Turnos Médicos

## Datos de la entrega

- **Materia:** Aplicaciones Interactivas  
- **Docentes:** María Paula Sarasa y Francisco Fares  
- **Grupo:** 2  
- **Integrantes:**
  - Martina Castro – Legajo 1167379  
  - Aylen Nahuel – Legajo 1135727  

---

## 1. Descripción general

Sistema completo de reserva y gestión de turnos para un consultorio médico.

El proyecto está dividido en dos partes:

- **Frontend (React):** landing pública, turnera interactiva, formulario de reserva, página de obras sociales, login de administrador y panel de administración.
- **Backend (Node.js + Express + MySQL):** API REST que maneja autenticación, obras sociales y turnos.

---

## 2. Stack tecnológico

**Frontend**
- React (Create React App)
- Material UI (MUI)
- React Router DOM
- Dayjs
- Context + hooks personalizados (notificaciones, obras sociales)

**Backend**
- Node.js + Express
- MySQL 8
- JWT para autenticación
- dotenv, cors, helmet, morgan

---

## 3. Requisitos previos

- Node.js 18+  
- npm  
- MySQL 8 (local o Docker)

---

## 4. Instalación de dependencias

```bash
# Clonar el repositorio
git clone <URL_DEL_REPO>
cd Prohealth_Martu

# Frontend
npm install

# Backend
cd server
npm install
```

---

## 5. Variables de entorno

### Frontend (`/.env`)

Desde la raíz del proyecto:

```bash
cp .env.example .env
```

Contenido esperado:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

### Backend (`/server/.env`)

```bash
cd server
cp .env.example .env
```

Ejemplo de configuración:

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

> Ajustar `DB_USER` y `DB_PASSWORD` según la instalación local de MySQL.

---

## 6. Inicializar la base de datos

Desde la raíz del proyecto:

```bash
cd server

# Crear base y tablas
mysql -u root -pmartucastro < db/schema.sql

# Cargar datos de ejemplo (obras sociales, admin, turnos)
mysql -u root -pmartucastro < db/seed.sql
```

Esto crea la base `ProHealth` y carga:

- Obras sociales: OSDE, IOMA, Galeno, Medife, OMINT, Swiss Medical.
- Usuario administrador demo:
  - **Email:** `admin@demo.com`
  - **Password:** `Admin123!`
- Algunos turnos de ejemplo.

---

## 7. Cómo levantar el proyecto

### Backend (API)

Desde `server/`:

```bash
npm run dev
```

API disponible en: `http://localhost:4000/api`

### Frontend (React)

En otra terminal, desde la **raíz**:

```bash
npm start
```

Frontend disponible en: `http://localhost:3000`

---

## 8. Funcionalidades entregadas

### Parte pública

- Landing con secciones: Hero, Servicios, Bio, Obras Sociales y Contacto.
- Página de Obras Sociales con cards responsivas y logos.
- Turnera interactiva (14 días hábiles, intervalos de 30 minutos).
- Formulario de reserva de turno:
  - Validación de nombre, teléfono, email, obra social y horario.
  - Evita horarios ocupados consultando a la API.

### Panel administrativo

- Login de profesional (`/login`) con autenticación JWT.
- Dashboard administrativo con acceso a:
  - Listado de turnos con filtros.
  - Cambio de estado del turno (Solicitada / Confirmada / Cancelada).
  - Eliminación de turnos.
- CRUD de obras sociales:
  - Alta, edición y baja de obras sociales.
  - Sincronizado con el selector del formulario público.

---

## 9. Estructura principal de carpetas

```text
Prohealth_Martu/
  README.md           # Este archivo
  .env.example        # Config de frontend
  package.json        # Frontend

  src/                # Código del frontend (React)
    components/       # Navbar, Hero, Turnera, InsuranceList, layouts, etc.
    pages/            # Home, Services, Insurances, Appointments, Login, Admin...
    hooks/            # useInsurances, useNotifications
    services/         # apiClient
    theme/            # Tema MUI
    utils/            # Helpers (calendario, etc.)

  server/             # Backend Node.js + Express
    README.md         # README específico del backend
    db/               # Scripts SQL (schema.sql, seed.sql)
    src/
      config/         # env, conexión MySQL
      controllers/    # Controladores
      middleware/     # Auth, validaciones, errores
      routes/         # Rutas /api
      services/       # Lógica de negocio
      utils/          # Helpers (JWT, asyncHandler, etc.)
```

---

## 10. Endpoints principales de la API

Base: `http://localhost:4000/api`

**Auth**
- `POST /auth/login` – Login de administrador (devuelve JWT).

**Obras sociales**
- `GET /insurances` – Listado público.
- `POST /insurances` – Crear (requiere JWT).
- `PUT /insurances/:id` – Editar (requiere JWT).
- `DELETE /insurances/:id` – Eliminar (requiere JWT).

**Turnos**
- `GET /appointments` – Listado/filtrado.
- `POST /appointments` – Crear turno.
- `PATCH /appointments/:id/status` – Cambiar estado (requiere JWT).
- `DELETE /appointments/:id` – Eliminar turno (requiere JWT).

Header de autenticación:

```http
Authorization: Bearer <token>
```

---

## 11. Checklist de la entrega

- [x] Frontend y backend instalan sin errores.
- [x] Base de datos inicializable con `schema.sql` y `seed.sql`.
- [x] API corriendo en `http://localhost:4000/api`.
- [x] Frontend corriendo en `http://localhost:3000`.
- [x] Reserva de turno funcionando (validaciones + horarios ocupados).
- [x] Login de administrador y panel operativo.
- [x] CRUD de obras sociales integrado con la app pública.
- [x] Diseño responsive en páginas principales.

