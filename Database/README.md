# 🗄️ Base de datos

La base de datos de Tura Limpia es **PostgreSQL**. No se crea a mano con un script SQL: la crean las **migraciones** del backend, y los **seeders** cargan el administrador inicial y los datos de prueba. Así cualquier integrante puede recrearla desde cero con dos comandos.

## Dónde está cada cosa

| Qué | Ubicación |
| --- | --- |
| Migraciones (tablas, llaves, índices y restricciones) | [`Backend/tura-limpia/src/migrations/`](../Backend/tura-limpia/src/migrations/) |
| Administrador inicial | [`Backend/tura-limpia/src/seeders/20261119060000-administrador-inicial.js`](../Backend/tura-limpia/src/seeders/20261119060000-administrador-inicial.js) |
| Datos mínimos de prueba | [`Backend/tura-limpia/src/seeders/20261123020000-datos-prueba.js`](../Backend/tura-limpia/src/seeders/20261123020000-datos-prueba.js) |
| Configuración de la conexión | `Backend/tura-limpia/src/config/config.js` y el archivo `.env` (ver `.env.example`) |
| Conexión desde NestJS | `Backend/tura-limpia/src/modules/database/` |

## Tablas

Las migraciones crean estas tablas, según el modelo entidad-relación del proyecto:

| Tabla | Para qué sirve |
| --- | --- |
| `administrador` | Usuario que entra al panel. El correo es único. |
| `vehiculo` | Vehículos de recolección: placa única y estado operativo. |
| `conductor` | Conductores: documento y licencia únicos, categoría y vencimiento de la licencia. |
| `barrio` | Barrios o sectores de Buenaventura. El nombre no se repite, sin distinguir mayúsculas. |
| `ruta` | Rutas de recolección. |
| `ruta_barrio` | Relación entre rutas y barrios (muchos a muchos). |
| `punto_ruta` | Puntos del trazado de cada ruta sobre el mapa, en orden. |
| `turno` | Turnos de trabajo. La hora de fin debe ser mayor que la de inicio. |
| `programacion` | Programación de un servicio: ruta, vehículo, conductor, turno y fecha. |
| `programacion_dia` | Días de la semana en que se repite cada programación. |
| `token_revocado` | Tokens invalidados al cerrar sesión. |

Sequelize agrega además la tabla `SequelizeMeta`, donde registra qué migraciones ya se aplicaron.

## Cómo crearla

1. Crear el usuario y la base vacía en PostgreSQL. Los pasos están en el [README principal](../README.md), paso 3.
2. Desde `Backend/tura-limpia`, con el `.env` configurado, ejecutar:

```bash
npm run migrate
```

```bash
npm run seed
```

`npm run seed` crea el administrador inicial con el correo y la contraseña de `ADMIN_CORREO` y `ADMIN_CONTRASENA` del `.env`. También carga 5 vehículos, 5 conductores, 8 barrios, 3 turnos, 3 rutas y 2 programaciones. Se puede ejecutar varias veces sin duplicar datos.

Para deshacer todas las migraciones y empezar de cero:

```bash
npm run migrate:undo:all
```
