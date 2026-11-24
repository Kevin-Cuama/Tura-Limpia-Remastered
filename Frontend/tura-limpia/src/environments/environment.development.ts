// Entorno de desarrollo (ng serve).
// Las peticiones a /api las redirige proxy.conf.json al backend en http://localhost:3000,
// así no hace falta habilitar CORS en Nest mientras se trabaja en local.
export const environment = {
  production: false,
  apiUrl: '/api/v1',
};
