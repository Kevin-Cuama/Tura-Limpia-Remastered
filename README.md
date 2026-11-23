# ♻️ Tura Limpia

**Tura Limpia** es una plataforma web orientada a la gestión y planificación de las operaciones de recolección en Buenaventura, que permite administrar de manera centralizada la información relacionada con vehículos, conductores, barrios, rutas, turnos y programación de servicios.

La solución busca facilitar la organización de los recursos operativos mediante una interfaz administrativa que permita registrar, consultar, actualizar y controlar la información necesaria para la ejecución de los servicios de recolección. Además, incluye un dashboard con indicadores que apoyen la toma de decisiones operativas.

---

**Acceso a la plataforma**  

**Enlace: https://github.com/Kevin-Cuama/Tura-Limpia-Remastered**  

**Usuario de prueba** [Correo]/[Contraseña]

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
| Frontend      | Angular     |  
| Backend       | Nest.js     |  
| Base de datos | PostgreSQL  |
| Control de versiones | Git, GitHub|


## 📂 Estructura del Repositorio

* `Backend/` — Lógica del servidor, APIs y servicios.
* `Base de datos/` — Scripts, modelos y configuración de la base de datos.
* `Documentación/` — Manuales, diagramas y documentación técnica del proyecto.
* `Frontend/` — Interfaz de usuario y componentes web.
* `Evidencias/` — Registros, capturas y soporte de pruebas/avances.
---

## ⚙️ Requisitos previos  
|programa |versión |descarga| 
|---------|--------|--------|  
| Node.js      |22 o superior (LTS)     |nodejs.org|  
| PostgreSQl 17|16 (sirve 15 o superior)|postgresql.org/download/windows|
| Git          |cualquiera reciente     |git-scm.com|
| Postman      |cualquiera(opcional     | postman.com/downloads  |  

Al instalar PostgreSQL: guarda la contraseña que elijas para el usuario postgres, deja el puerto en 5432 y la configuración regional por defecto, y desmarca Stack Builder en la última pantalla  
Para comprobar que quedaron instalados, abre PowerShell y ejecuta:  
git --version
node -v  


## 🚀 Instalación y Ejecución 
**1 clonar el repositorio**  
git clone https://github.com/Kevin-Cuama/Tura-Limpia-Remastered.git  
cd Tura-Limpia-Remastered  
git checkout acceso-administrativo  
**2 crear la base de datos**  
Abrir la consola de PostgreSQL (pide la contraseña de postgres; no se ve mientras se escribe):  
& 'C:\Program Files\PostgreSQL\16\bin\psql.exe' -U postgres -h localhost  
Cuando aparezca postgres=#, escribir una por una:  
CREATE USER tura WITH PASSWORD 'tura';
CREATE DATABASE tura_limpia OWNER tura;
\q  
Debe responder CREATE ROLE y CREATE DATABASE. Si dice que ya existen, se continúa. Estas credenciales son solo para desarrollo local.  




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
