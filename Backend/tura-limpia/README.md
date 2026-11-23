# Tura Limpia — Backend

API REST del panel administrativo de Tura Limpia.

**Tecnologías:** NestJS 12 · TypeScript · Sequelize 6 · PostgreSQL · JWT · bcrypt · Vitest

## Requisitos

- Node.js 22 o superior
- PostgreSQL 14 o superior, con una base de datos vacía creada (por ejemplo `tura_limpia`)

## Instalación

Todos los comandos se ejecutan dentro de la carpeta `Backend/tura-limpia`.

```bash
npm install
```

```bash
cp .env.example .env
```

Abra `.env` y complete los datos de su PostgreSQL y del administrador inicial.

### Variables de entorno

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto del backend | `3000` |
| `CORS_ORIGENES` | Direcciones del frontend que pueden llamar a la API, separadas por coma. Vacío = cualquiera (solo para desarrollo) | `http://localhost:5173` |
| `DB_HOST` | Servidor de PostgreSQL | `localhost` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_USER` | Usuario de PostgreSQL | `postgres` |
| `DB_PASS` | Contraseña de PostgreSQL | |
| `DB_NAME` | Nombre de la base de datos | `tura_limpia` |
| `JWT_SECRET` | Secreto para firmar los tokens de sesión | texto largo y aleatorio |
| `JWT_EXPIRES_IN` | Duración de la sesión | `8h` |
| `BCRYPT_SALTOS` | Costo del hash de contraseñas | `10` |
| `ADMIN_NOMBRE` | Nombre del administrador inicial | `Administrador` |
| `ADMIN_CORREO` | Correo del administrador inicial | `admin@turalimpia.com` |
| `ADMIN_CONTRASENA` | Contraseña del administrador inicial | |

## Crear la base de datos desde cero

```bash
npm run migrate
```

Crea todas las tablas del modelo entidad-relación: `administrador`, `vehiculo`, `conductor`, `barrio`, `ruta`, `ruta_barrio`, `punto_ruta`, `turno`, `programacion` y `programacion_dia`, con sus llaves y restricciones. También crea `token_revocado`, una tabla técnica donde se guardan los tokens de las sesiones cerradas.

```bash
npm run seed
```

Crea el **administrador inicial** con los datos de `ADMIN_CORREO` y `ADMIN_CONTRASENA`, y carga los **datos mínimos de prueba**. Se puede ejecutar varias veces sin duplicar registros.

| Datos de prueba | Contenido |
| :--- | :--- |
| Vehículos | 5 (placas `TLA101` a `TLA105`): 2 disponibles, 1 en servicio, 1 en mantenimiento, 1 desactivado |
| Conductores | 5: 4 activos (uno con la licencia vencida) y 1 inactivo |
| Barrios | 8 barrios de Buenaventura |
| Turnos | Mañana (06:00–14:00), Tarde (14:00–22:00), Madrugada (00:00–06:00) |
| Rutas | 2 activas con recorrido trazado y 1 suspendida sin recorrido |
| Programaciones | 2 activas que empiezan el día en que se cargan |

Para volver a empezar con la base de datos vacía:

```bash
npm run migrate:undo:all
```

## Ejecutar

```bash
npm run start:dev
```

El backend queda disponible en `http://localhost:3000`.

## Verificar el acceso administrativo

Los ejemplos usan `curl`; también se pueden hacer desde Postman o Insomnia. Reemplace el correo y la contraseña por los de su `.env`.

**1. Iniciar sesión con credenciales correctas** → `200` con el token

```bash
curl -X POST http://localhost:3000/api/v1/login -H "Content-Type: application/json" -d '{"correo":"admin@turalimpia.com","contrasena":"SU_CONTRASENA"}'
```

```json
{
  "mensaje": "Bienvenido administrador",
  "token": "eyJhbGciOi...",
  "administrador": { "id": 1, "nombre": "Administrador", "correo": "admin@turalimpia.com" }
}
```

**2. Credenciales incorrectas** → `401` con un mensaje comprensible

```bash
curl -X POST http://localhost:3000/api/v1/login -H "Content-Type: application/json" -d '{"correo":"admin@turalimpia.com","contrasena":"incorrecta"}'
```

```json
{ "message": "Correo o contraseña incorrectos.", "error": "Unauthorized", "statusCode": 401 }
```

**3. Ruta protegida sin token** → `401`

```bash
curl http://localhost:3000/api/v1/administrador/perfil
```

```json
{ "message": "Token no proporcionado.", "error": "Unauthorized", "statusCode": 401 }
```

**4. Ruta protegida con un token falso o vencido** → `401`

```bash
curl http://localhost:3000/api/v1/administrador/perfil -H "Authorization: Bearer token_falso"
```

```json
{ "message": "Token inválido o expirado.", "error": "Unauthorized", "statusCode": 401 }
```

**5. Ruta protegida con el token del paso 1** → `200`

```bash
curl http://localhost:3000/api/v1/administrador/perfil -H "Authorization: Bearer EL_TOKEN_DEL_PASO_1"
```

**6. Cerrar sesión con el token del paso 1** → `200`

```bash
curl -X POST http://localhost:3000/api/v1/logout -H "Authorization: Bearer EL_TOKEN_DEL_PASO_1"
```

```json
{ "mensaje": "Sesión cerrada correctamente." }
```

**7. Usar el mismo token después de cerrar sesión** → `401`

```bash
curl http://localhost:3000/api/v1/administrador/perfil -H "Authorization: Bearer EL_TOKEN_DEL_PASO_1"
```

```json
{ "message": "La sesión fue cerrada. Inicie sesión de nuevo.", "error": "Unauthorized", "statusCode": 401 }
```

El token cerrado queda inválido aunque alguien lo haya guardado. Para volver a entrar hay que iniciar sesión de nuevo.

## Pruebas

Pruebas unitarias (no necesitan base de datos):

```bash
npm test
```

Pruebas de punta a punta del acceso administrativo: login, credenciales incorrectas, rutas protegidas, cierre de sesión y CORS. Usan la base de datos del `.env`, así que primero hay que crearla y cargar el administrador:

```bash
npm run migrate
```

```bash
npm run seed
```

```bash
npm run test:e2e
```

## Estructura

```
src/
├── configs/       Configuración leída del .env
├── core/          Guard de administrador, constantes de errores y utilidades compartidas
├── migrations/    Migraciones de la base de datos
├── seeders/       Administrador inicial y datos de prueba
└── modules/       Un módulo por funcionalidad (controller, service, dtos, interfaces, models, repositories)
```
