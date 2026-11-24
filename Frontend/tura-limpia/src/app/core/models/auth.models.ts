// Tipos que reflejan exactamente lo que responde el backend (Nest.js)
// en el módulo de autenticación: POST /api/v1/login

export interface CredencialesLogin {
  correo: string;
  contrasena: string;
}

export interface Administrador {
  id: number;
  nombre: string;
  correo: string;
}

export interface RespuestaLogin {
  mensaje: string;
  token: string;
  administrador: Administrador;
}

// Forma de los errores de Nest: message puede ser un texto o una lista
// (la lista llega cuando falla el ValidationPipe, por ejemplo un correo mal escrito).
export interface ErrorApi {
  message: string | string[];
  error?: string;
  statusCode: number;
}
