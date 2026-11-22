export const MensajesError = {
  // Autenticación (401 Unauthorized)
  CREDENCIALES_INVALIDAS: 'Correo o contraseña incorrectos.',
  TOKEN_NO_PROPORCIONADO: 'Token no proporcionado.',
  TOKEN_INVALIDO_O_EXPIRADO: 'Token inválido o expirado.',

  // Permisos y Autorización (401/403)
  SIN_PERMISOS_ADMINISTRADOR: 'No tienes permisos de administrador.',

  // Recursos no encontrados (404 Not Found)
  ADMINISTRADOR_NO_ENCONTRADO: 'Administrador no encontrado.',
} as const;

export type TMensajeError = (typeof MensajesError)[keyof typeof MensajesError];
