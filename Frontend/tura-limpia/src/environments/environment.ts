// Entorno de producción (ng build).
// Al desplegar, cambia apiUrl por la URL pública del backend, por ejemplo:
//   apiUrl: 'https://tura-limpia-backend.up.railway.app/api/v1'
// y recuerda que el backend debe permitir el dominio del frontend con app.enableCors().
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api/v1',
};
