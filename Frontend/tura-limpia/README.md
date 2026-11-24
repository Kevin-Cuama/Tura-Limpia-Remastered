# Tura Limpia — Frontend (Angular)

Panel administrativo de Tura Limpia. En esta entrega incluye:

| Requisito | Qué hace |
| :--- | :--- |
| RF-01 Iniciar sesión | Pantalla de login contra `POST /api/v1/login`. Muestra el mensaje del backend si las credenciales son incorrectas. |
| RF-02 Cerrar sesión | Botón "Cerrar sesión" en la barra superior de todas las pantallas del panel. |
| RF-03 Control de acceso | Sin sesión válida no se entra al panel (`authGuard`). Cada petición lleva el token y, si el backend responde 401, se cierra la sesión. |
| RF-19 Dashboard | Indicadores de vehículos, conductores y rutas, y accesos a los módulos. |

## Requisitos

- Node.js 22 o superior
- El backend (`Backend/tura-limpia`) corriendo en `http://localhost:3000`, con la migración y el seeder del administrador ejecutados

## Cómo correrlo

```bash
cd Frontend/tura-limpia
npm install
npm start
```

Abre http://localhost:4200 e inicia sesión con el `ADMIN_CORREO` y `ADMIN_CONTRASENA` del `.env` del backend.

En desarrollo, `proxy.conf.json` envía las peticiones de `/api` al backend en el puerto 3000, así que no hace falta habilitar CORS en Nest para trabajar en local.

Pruebas unitarias: `npm test`

## Estructura

```
src/app/
├── core/
│   ├── models/auth.models.ts          Tipos de la respuesta del login
│   ├── services/auth.service.ts       Inicia y cierra sesión, guarda el token
│   ├── interceptors/auth.interceptor.ts  Agrega "Authorization: Bearer <token>"
│   └── guards/auth.guard.ts           Protege el panel y redirige el login
├── layout/panel-layout/               Menú lateral + barra superior (cerrar sesión)
├── features/
│   ├── auth/login/                    Pantalla de inicio de sesión
│   ├── dashboard/                     Indicadores y accesos a módulos
│   └── modulo-pendiente/              Página temporal de los módulos de próximos sprints
├── app.routes.ts                      Rutas de la aplicación
└── app.config.ts                      HttpClient, interceptor e idioma es-CO
```

## Indicadores del dashboard (pendiente en el backend)

El dashboard pide los indicadores a `GET /api/v1/dashboard/indicadores`. Ese endpoint todavía no existe, así que por ahora muestra **datos de ejemplo** con un aviso visible. Cuando el equipo de backend lo cree (protegido con `AdministradorGuard`), el panel usará los datos reales sin cambiar nada en el frontend. La respuesta esperada es:

```json
{
  "vehiculos":   { "total": 18, "disponibles": 9, "enServicio": 5, "mantenimiento": 3, "fueraDeServicio": 1 },
  "conductores": { "total": 24, "activos": 21, "inactivos": 3 },
  "rutas":       { "total": 14, "activas": 12, "suspendidas": 2, "programadas": 10 }
}
```

## Despliegue

1. En `src/environments/environment.ts`, cambia `apiUrl` por la URL pública del backend.
2. En el backend, habilita CORS para el dominio del frontend en `main.ts`:
   ```ts
   app.enableCors({ origin: ['https://tu-frontend.vercel.app'] });
   ```
3. `npm run build` genera la app en `dist/tura-limpia/browser`.
