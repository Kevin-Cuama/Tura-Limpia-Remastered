# 📸 Evidencias

Capturas del funcionamiento de cada entrega. Las imágenes se pueden ver directamente en GitHub.

## Semana 1: Acceso administrativo

Las capturas corresponden al código del release [`semana-1`](https://github.com/Kevin-Cuama/Tura-Limpia-Remastered/releases/tag/semana-1). Los pasos para reproducirlas están en el [README principal](../README.md), puntos 1 a 7.

### Base de datos y backend

La conexión con PostgreSQL está configurada; las migraciones crean la base desde cero; existe el administrador inicial y datos de prueba; el backend responde.

**Captura 01 - Migraciones**

![Captura 01 - Migraciones](Semana%201/Captura%2001%20-%20Migraciones.png)

**Captura 02 - Seeders**

![Captura 02 - Seeders](Semana%201/Captura%2002%20-%20Seeders.png)

**Captura 08 - Tablas**

![Captura 08 - Tablas](Semana%201/Captura%2008%20-%20Tablas.png)

**Captura 09 - Datos de pruebas de vehiculos**

![Captura 09 - Datos de pruebas de vehiculos](Semana%201/Captura%2009%20-%20Datos%20de%20pruebas%20de%20vehiculos.png)

**Captura 10 - Datos del Admin**

![Captura 10 - Datos del Admin](Semana%201/Captura%2010%20-%20Datos%20del%20Admin.png)

**Captura 25 - Conexion con la DB**

![Captura 25 - Conexion con la DB](Semana%201/Captura%2025%20-%20Conexion%20con%20la%20DB.png)

**Captura 26 - Codigo de Migraciones**

![Captura 26 - Codigo de Migraciones](Semana%201/Captura%2026%20-%20Codigo%20de%20Migraciones.png)

**Captura 27 - Seeder del Admin**

![Captura 27 - Seeder del Admin](Semana%201/Captura%2027%20-%20Seeder%20del%20Admin.png)

**Captura 06 -Levantamiento del BackEnd**

![Captura 06 -Levantamiento del BackEnd](Semana%201/Captura%2006%20-Levantamiento%20del%20BackEnd.png)

**Captura 03 - Pruebas unitarias**

![Captura 03 - Pruebas unitarias](Semana%201/Captura%2003%20-%20Pruebas%20unitarias.png)

**Captura 04 - Pruebas e2e A**

![Captura 04 - Pruebas e2e A](Semana%201/Captura%2004%20-%20Pruebas%20e2e%20A.png)

**Captura 05 - Pruebas e2e B**

![Captura 05 - Pruebas e2e B](Semana%201/Captura%2005%20-%20Pruebas%20e2e%20B.png)

### Frontend y acceso administrativo en el navegador

Inicio de sesión, mensaje con credenciales incorrectas, dashboard con acceso a los módulos, sesión que persiste al recargar y cierre de sesión.

**Captura 07 - Levantamiento del FrontEnd**

![Captura 07 - Levantamiento del FrontEnd](Semana%201/Captura%2007%20-%20Levantamiento%20del%20FrontEnd.png)

**Captura 11 - Proyecto en Vivo**

![Captura 11 - Proyecto en Vivo](Semana%201/Captura%2011%20-%20Proyecto%20en%20Vivo.png)

**Captura 12 - Datos incorrectos**

![Captura 12 - Datos incorrectos](Semana%201/Captura%2012%20-%20Datos%20incorrectos.png)

**Captura 13 - Dashboard del Admin**

![Captura 13 - Dashboard del Admin](Semana%201/Captura%2013%20-%20Dashboard%20del%20Admin.png)

**Captura 14 - La sesión persiste tras F5**

![Captura 14 - La sesión persiste tras F5](Semana%201/Captura%2014%20-%20La%20sesi%C3%B3n%20persiste%20tras%20F5.png)

**Captura 15 - Modulo de Vehículos**

![Captura 15 - Modulo de Vehículos](Semana%201/Captura%2015%20-%20Modulo%20de%20Veh%C3%ADculos.png)

**Captura 16 - Sesión Cerrada**

![Captura 16 - Sesión Cerrada](Semana%201/Captura%2016%20-%20Sesi%C3%B3n%20Cerrada.png)

**Captura 18 - Datos de Token y Sesión en Chrome**

![Captura 18 - Datos de Token y Sesión en Chrome](Semana%201/Captura%2018%20-%20Datos%20de%20Token%20y%20Sesi%C3%B3n%20en%20Chrome.png)

### Pruebas contra la API (Postman)

El backend genera y valida el token, protege las rutas e invalida el token al cerrar sesión.

**Captura 19 - Iniciar Sesion (200)**

![Captura 19 - Iniciar Sesion (200)](Semana%201/Captura%2019%20-%20Iniciar%20Sesion%20%28200%29.png)

**Captura 20 - Correo o Contraseña Incorrecto (401)**

![Captura 20 - Correo o Contraseña Incorrecto (401)](Semana%201/Captura%2020%20-%20Correo%20o%20Contrase%C3%B1a%20Incorrecto%20%28401%29.png)

**Captura 21 - Ver Perfil del Administrador (200)**

![Captura 21 - Ver Perfil del Administrador (200)](Semana%201/Captura%2021%20-%20Ver%20Perfil%20del%20Administrador%20%28200%29.png)

**Captura 22 - Ver Perfil sin Token (401)**

![Captura 22 - Ver Perfil sin Token (401)](Semana%201/Captura%2022%20-%20Ver%20Perfil%20sin%20Token%20%28401%29.png)

**Captura 23 - Cerrar Sesión (200)**

![Captura 23 - Cerrar Sesión (200)](Semana%201/Captura%2023%20-%20Cerrar%20Sesi%C3%B3n%20%28200%29.png)

**Captura 24 - Usar el Token Después de Cerrar Sesión**

![Captura 24 - Usar el Token Después de Cerrar Sesión](Semana%201/Captura%2024%20-%20Usar%20el%20Token%20Despu%C3%A9s%20de%20Cerrar%20Sesi%C3%B3n.png)

**Captura 17 - Token Revocado**

![Captura 17 - Token Revocado](Semana%201/Captura%2017%20-%20Token%20Revocado.png)

### Código relevante

Fragmentos del código que implementan el acceso administrativo.

**Captura 28 - Código del Login**

![Captura 28 - Código del Login](Semana%201/Captura%2028%20-%20C%C3%B3digo%20del%20Login.png)

**Captura 29 - Código Guard del BackEnd**

![Captura 29 - Código Guard del BackEnd](Semana%201/Captura%2029%20-%20C%C3%B3digo%20Guard%20del%20BackEnd.png)

**Captura 30 - Código Ruta Protegida**

![Captura 30 - Código Ruta Protegida](Semana%201/Captura%2030%20-%20C%C3%B3digo%20Ruta%20Protegida.png)

**Captura 31 - Código Guard del FrontEnd**

![Captura 31 - Código Guard del FrontEnd](Semana%201/Captura%2031%20-%20C%C3%B3digo%20Guard%20del%20FrontEnd.png)

**Captura 32 - Código de Rutas del FrontEnd**

![Captura 32 - Código de Rutas del FrontEnd](Semana%201/Captura%2032%20-%20C%C3%B3digo%20de%20Rutas%20del%20FrontEnd.png)

**Captura 33 - Código Interceptor**

![Captura 33 - Código Interceptor](Semana%201/Captura%2033%20-%20C%C3%B3digo%20Interceptor.png)

---

`Evidencias.rar` contiene estas mismas capturas comprimidas.
