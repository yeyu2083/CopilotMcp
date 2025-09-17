# CopilotMcp

Aplicación web de demostración con sistema de login básico, construida con Node.js, Express y PostgreSQL.

## Características

### 🔐 Sistema de Login
- Página de login simple y elegante (`/login`)
- Validación de credenciales hardcoded para demo
- Manejo de errores y mensajes de estado
- Redirección automática tras login exitoso

### 🗄️ Base de Datos
- Integración con PostgreSQL
- Registro de visitantes con timestamps e IPs
- Estadísticas de visitas en tiempo real

### 🎨 Interfaz
- Diseño moderno con gradientes
- Responsive design
- Efectos de glassmorphism

## Credenciales de Demo

| Usuario | Contraseña |
|---------|------------|
| `admin` | `123456`   |
| `user`  | `password` |

## Instalación y Uso

```bash
# Instalar dependencias
npm install

# Iniciar servidor (modo desarrollo)
npm run dev

# Iniciar servidor (modo producción)
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Rutas Disponibles

- `/` - Página principal con estadísticas
- `/login` - Página de login
- `/api/login` - Endpoint POST para autenticación
- `/health` - Health check de la aplicación

## Pruebas

```bash
# Ejecutar pruebas automatizadas con Playwright
npm test

# Ejecutar pruebas en modo visual
npm run test:headed

# Ejecutar pruebas en modo debug
npm run test:debug
```

## API Endpoints

### POST /api/login

Autentica un usuario con credenciales.

**Request:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response (éxito):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": "admin"
}
```

**Response (error):**
```json
{
  "success": false,
  "message": "Credenciales inválidas"
}
```

## Docker

La aplicación está preparada para ejecutarse con Docker y PostgreSQL:

```bash
docker-compose up
```

## Tecnologías

- **Backend:** Node.js, Express.js
- **Base de Datos:** PostgreSQL
- **Frontend:** HTML, CSS, JavaScript vanilla
- **Testing:** Playwright
- **Contenedores:** Docker