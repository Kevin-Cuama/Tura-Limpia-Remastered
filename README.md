# ♻️ Tura Limpia

**Tura Limpia** es una plataforma web orientada a la gestión y planificación de las operaciones de recolección en Buenaventura, que permite administrar de manera centralizada la información relacionada con vehículos, conductores, barrios, rutas, turnos y programación de servicios.

La solución busca facilitar la organización de los recursos operativos mediante una interfaz administrativa que permita registrar, consultar, actualizar y controlar la información necesaria para la ejecución de los servicios de recolección. Además, incluye un dashboard con indicadores que apoyen la toma de decisiones operativas.

---

**Acceso a la plataforma**  

**Enlace: https://github.com/Kevin-Cuama/Tura-Limpia-Remastered**  

**Usuario de prueba** [admin@turalimpia.com]/[ Admin12345]

## ✨Funcionalidades  

| Módulo | Qué permite |
|--------|-------------|  
| Acceso | Inicio y cierre de sesión del administrador,control de acceso al panel y creación del administrador inicial.|  
| Vehiculos | Registro, consulta, edición y desactivación y estado operativo(disponible, en servicio, mantenimiento o fuera de servicio|
| Conductores | Registro, consulta, edición y desactivación, con documento y licencia únicos, categoria y vencimiento de la licencia. |
| Barrios y rutas | Gestón de barrios o sectores, creación y edición de rutas suspensión y reactivación |
| Mapa | Trazado del recorrido de cada ruta sobre un mapa de Buenaventura, con almacenamiento y reconstrucción. |
| Turnos y programación | Turnos de trabajo, programación  de servicios, validación de disponibilidad y advertencia de conflictos |
| Dashboard | Indicadores de vehiculos, conductores y rutas, y consulta de los servicios del día con filtros. |  

## 🛠️ Tecnologias 

| Capa          | Tecnología  |
|---------------|-------------|  
| Frontend      | Angular 22, TypeScript |  
| Backend       | NestJS 12, TypeScript, Sequelize 6, JWT, bcrypt, Vitest |  
| Base de datos | PostgreSQL 16 |
| Control de versiones | Git, GitHub (ramas y pull requests) |


## 📂 Estructura del Repositorio

* `Backend/` — Lógica del servidor, APIs y servicios.
* `Database/` — Explicación de cómo se crea la base de datos (migraciones y datos de prueba).
* `Docs/` — Manuales, diagramas, documentación técnica y colección de Postman.
* `Frontend/` — Interfaz de usuario y componentes web.
* `Evidencias/` — Registros, capturas y soporte de pruebas/avances.
---

## ⚙️ 1 Requisitos previos 

|programa |versión |descarga| 
|---------|--------|--------|  
| Node.js      |22 o superior (LTS)     |nodejs.org|  
| PostgreSQL   |16 (sirve 15 o superior)|postgresql.org/download/windows|
| Git          |cualquiera reciente     |git-scm.com|
| Postman      |cualquiera (opcional)   | postman.com/downloads  |  

Al instalar PostgreSQL: guarda la contraseña que elijas para el usuario postgres, deja el puerto en 5432 y la configuración regional por defecto, y desmarca Stack Builder en la última pantalla  
Para comprobar que quedaron instalados, abre PowerShell y ejecuta:  
git --version
node -v  


## 🚀 Instalación y Ejecución 

**2 descargar el repositorio**  
En PowerShell, desde la carpeta donde quieras guardar el proyecto:  
`git clone https://github.com/Kevin-Cuama/Tura-Limpia-Remastered.git  
cd Tura-Limpia-Remastered`  
La rama principal (`Produccion`) ya contiene la entrega 1 completa; no hace falta cambiar de rama.  

  
**3 crear la base de datos**  

Abre la consola de PostgreSQL. Te pedirá la contraseña de postgres ; no se ve mientras escribes, es normal.
`& 'C:\Program Files\PostgreSQL\16\bin\psql.exe' -U postgres -h localhost`  
Cuando aparezca `postgres=#,` escribir una por una:  
`CREATE USER tura WITH PASSWORD 'tura';
CREATE DATABASE tura_limpia OWNER tura;
\q ` 
Debe responder `CREATE ROLE` y `CREATE DATABASE`. Si dice que ya existen, se continúa. Estas credenciales son solo para desarrollo local.  

**4 Backend** 

**4.1 Instalar dependencias** 

Desde la carpeta del repositorio:  
`cd Backend\tura-limpia`  
`npm install`  
Los avisos de "vulnerabilities" son normales.No ejecutes `npm audit fix.`  

**4.2 Crear el archivo .env**  

`Copy-Item .env.example .env`  
Genera una clave secreta y copia el texto que salga:  
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
Abre el archivo con el Bloc de notas:  
`notepad .env`  
Cambia estas líneas, guarda y cierra. Las demás `PORT=3000 , DB_PORT=5432` , etc.) se quedan como vienen.  
`DB_USER=tura  
DB_PASS=tura  
DB_NAME=tura_limpia  
JWT_SECRET=<pega aquí la clave que generaste>  
ADMIN_CORREO=admin@turalimpia.com  
ADMIN_CONTRASENA=Admin12345`  
 El archivo `.env` nunca se sube a GitHub y no se muestra en capturas.  
 
**4.3 Crear las tablas y los datos de prueba**  

`npm run migrate  
npm run seed`  
`migrate` crea 12 tablas. `seed` crea el administrador y datos de prueba (5 vehículos, 5 conductores, 3 rutas, 8 barrios, 3 turnos y 2 programaciones).  

**4.4 Pruebas (opcional)**  

`npm test  
npm run test:e2e`  
Deben pasar 21 pruebas unitarias y 7 e2e.  

**4.5 Levantar el backend**  

`npm run start:dev`  
Está listo cuando aparecen "Conexión exitosa con PostgreSQL" y "Nest application successfully started". Deja esta ventana abierta y no hagas clic dentro de ella.

**5. Frontend**  

Abre otra ventana de PowerShell (la del backend sigue corriendo) y entra a la carpeta del frontend dentro del repositorio:  
`cd <ruta-del-repositorio>\Frontend\tura-limpia  
npm install  
npm start`  
Está listo cuando aparece `Local: http://localhost:4200/` . Deja esta ventana abierta también. Los avisos de `install-scripts durante npm install` son normales.  

**6. Entrar al sistema**   

1. Abre **http://localhost:4200** en el navegador.
2.  Inicia sesión con **admin@turalimpia.com / Admin12345**.
3.  Debe entrar al dashboard.
 El aviso "Estás viendo datos de ejemplo…" es normal: los indicadores del dashboard llegan en una entrega posterior. Lo mismo pasa con las páginas "en construcción" de Vehículos, Conductores, Rutas y Programación.

**7. Verificar el acceso administrativo**
    se verifica de dos formas: en el navegador (lo que ve el usuario) y contra la API (lo que valida el backend). Las dos necesitan el backend y el frontend corriendo.  
    
  **7.1 En el navegador** 
  
|# |Que hacer |Resultado esperado| 
|--|----------|------------------|  
| 1 |Sin haber iniciado sesión, abrir http://localhost:4200/dashboard |Redirige al login|  
| 2 |Iniciar sesión con una contraseña incorrecta |Muestra un mensaje de error|  
| 3 |Iniciar sesión con admin@turalimpia.com / Admin12345 |Entra al dashboard|  
| 4 |Recargar la página (F5) dentro del dashboard |La sesión sigue abierta|   
| 5 |Clic en Vehículos, Conductores, Rutas o Programación |Abre la página del módulo ("en construcción" en esta entrega)|   
| 6 |Clic en Cerrar sesión |Vuelve al login|   
| 7 |Volver a abrir http://localhost:4200/dashboard|Pide iniciar sesión otra vez|    

**7.2 Contra la API, con PowerShell**  

Abre una tercera ventana de PowerShell y ejecuta los bloques en orden. En los casos que deben fallar, PowerShell muestra el mensaje en rojo; eso es lo esperado. Credenciales incorrectas → 401 "Correo o contraseña incorrectos.":  
`Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/v1/login -ContentType 'application/json' -Body '{"correo":"admin@turalimpia.com","contrasena":"incorrecta"}'`  

Credenciales correctas → "Bienvenido administrador", con token. El token queda guardado en '$h' para los pasos siguientes:   
```powershell
$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/v1/login -ContentType 'application/json' -Body '{"correo":"admin@turalimpia.com","contrasena":"Admin12345"}'
$r.mensaje
$h = @{ Authorization = "Bearer $($r.token)" }
```

Ruta protegida sin token → 401 "Token no proporcionado.":  
`Invoke-RestMethod -Uri http://localhost:3000/api/v1/administrador/perfil`  

Ruta protegida con un token falso → 401 "Token inválido o expirado.":  
`Invoke-RestMethod -Uri http://localhost:3000/api/v1/administrador/perfil -Headers @{ Authorization = 'Bearer token_falso' }`  

Ruta protegida con el token válido → solo id, nombre y correo:  
`Invoke-RestMethod -Uri http://localhost:3000/api/v1/administrador/perfil -Headers $h`  

Cerrar sesión → "Sesión cerrada correctamente.":  
`Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/v1/logout -Headers $h`  

El mismo token después de cerrar sesión → 401 "La sesión fue cerrada. Inicie sesión de nuevo.":  
`Invoke-RestMethod -Uri http://localhost:3000/api/v1/administrador/perfil -Headers $h`  

**7.3 Con Postman (alternativa)**  

1. Importar `Docs/Postman/Tura-Limpia-API.postman_collection.json`.  
2. En las variables de la colección, poner 'contrasena' = 'Admin12345' y guardar. 'correo' ya viene como admin@turalimpia.com.  
3. Ejecutar solo las carpetas "1. Autenticación" y "9. Cierre de sesión". Las carpetas 2 a 8 son de entregas siguientes y responden 404.  
Los mismos casos, con `curl` para Linux o Mac, están en `Backend/tura-limpia/README.md`, sección "Verificar el acceso administrativo".

**8. Problemas comunes**  

| Problema         | Solución  |
|---------------|-------------|  
|El login se queda en "Verificando..." | Se hizo clic dentro de la ventana del backend y Windows la congeló ("modo de selección"). Entra a esa ventana y presiona **Esc.**|  
|'psql' no se reconoce como comando|Usa la ruta completa: '& 'C:\Program Files\PostgreSQL\16\bin\psql.exe' ...'|  
| 'password authentication failed for user "tura" '|Revisa que el '.env' tenga 'DB_USER=tura' y 'DB_PASS=tura' , y que el paso 3 haya funcionado.|  
|'port 3000 already in use '|Ya hay otro backend corriendo. Cierra esa ventana.|  
|El backend no se conecta a PostgreSQL|Abre Servicios de Windows y enciende 'postgresql-x64-16.'|  
|El dashboard muestra un correo viejo|Cierra sesión, o presiona F12 → Application → Local Storage → Clear, y recarga.|  

**9. Para volver a usarlo otro día**  
Los pasos 1 a 4.4 se hacen una sola vez. Después solo hace falta  
1. PostgreSQL arranca solo con Windows.
2. Backend: 'npm run start:dev' en 'Backend\tura-limpia.'
3. Frontend, en otra ventana: 'npm start' en 'Frontend\tura-limpia.'
4.  Abrir http://localhost:4200. Para apagarlos, presiona Ctrl + C en cada ventana.


## Nombre el Equipo: EcoTura (Empresa 2)

## 👥 Equipo de Desarrollo

| Integrante | Rol |
| :--- | :--- |
| **Johan Steven Grueso Cetter** | Backend |
| **Harold Ricardo Arroyo Bueno** | Backend |
| **Rodrigo Arturo Pérez Angulo** | Backend |
| **William David Riascos Asprilla** | Base de Datos |
| **Kevin Andres Cuama Valencia** | Frontend |
| **Jhonier Julián Riascos Cortes** | Frontend |
| **Geraldine Andrea Valencia Riascos** | Documentación y QA |
| **Lina María Alomia Viveros** | Documentación y QA |
| **Joselin Adriana Ruiz Prado** | Documentación y QA |
