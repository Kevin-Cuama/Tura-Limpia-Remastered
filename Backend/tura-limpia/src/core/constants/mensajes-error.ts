export const MensajesError = {
  // Autenticación (401 Unauthorized)
  CREDENCIALES_INVALIDAS: 'Correo o contraseña incorrectos.',
  TOKEN_NO_PROPORCIONADO: 'Token no proporcionado.',
  TOKEN_INVALIDO_O_EXPIRADO: 'Token inválido o expirado.',
  SESION_CERRADA: 'La sesión fue cerrada. Inicie sesión de nuevo.',

  // Permisos y Autorización (401/403)
  SIN_PERMISOS_ADMINISTRADOR: 'No tienes permisos de administrador.',

  // Recursos no encontrados (404 Not Found)
  ADMINISTRADOR_NO_ENCONTRADO: 'Administrador no encontrado.',
  VEHICULO_NO_ENCONTRADO: 'El vehículo no existe.',
  CONDUCTOR_NO_ENCONTRADO: 'El conductor no existe.',
  BARRIO_NO_ENCONTRADO: 'El barrio no existe.',
  BARRIOS_NO_ENCONTRADOS: 'Uno o más barrios seleccionados no existen.',
  RUTA_NO_ENCONTRADA: 'La ruta no existe.',
  TURNO_NO_ENCONTRADO: 'El turno no existe.',
  PROGRAMACION_NO_ENCONTRADA: 'La programación no existe.',

  // Datos repetidos (409 Conflict) — RF-05, RF-07, RF-09, RF-10
  PLACA_REPETIDA: 'Ya existe un vehículo con esa placa.',
  DOCUMENTO_REPETIDO: 'Ya existe un conductor con ese número de documento.',
  LICENCIA_REPETIDA: 'Ya existe un conductor con ese número de licencia.',
  BARRIO_REPETIDO: 'Ya existe un barrio con ese nombre.',
  RUTA_REPETIDA: 'Ya existe una ruta con ese nombre.',
  TURNO_REPETIDO: 'Ya existe un turno con ese nombre.',
  REGISTRO_REPETIDO: 'Ya existe un registro con esos datos.',
  REGISTRO_EN_USO: 'No se puede completar la acción porque el registro está en uso.',

  // Reglas de negocio (400 / 409)
  VEHICULO_INACTIVO_SIN_ESTADO:
    'El vehículo está desactivado. Actívelo antes de cambiar su estado operativo.',
  HORARIO_INVALIDO: 'La hora de finalización debe ser posterior a la hora de inicio.',
  RECORRIDO_MINIMO: 'El recorrido necesita al menos 2 puntos: el inicio y el final.',
  PUNTO_FUERA_DE_BUENAVENTURA: 'Todos los puntos del recorrido deben estar en Buenaventura.',
  BARRIOS_DUPLICADOS: 'No repita barrios en la misma ruta.',
  DIAS_DUPLICADOS: 'No repita días de la semana en la misma programación.',
  FECHA_PASADA: 'La fecha de inicio de la programación no puede ser anterior a hoy.',
  PROGRAMACION_CANCELADA:
    'La programación está cancelada; ya no se puede editar ni reactivar. Cree una nueva.',
  PROGRAMACION_YA_CANCELADA: 'La programación ya estaba cancelada.',

  // RF-17: disponibilidad de recursos
  VEHICULO_NO_DISPONIBLE: 'No se puede programar el vehículo',
  CONDUCTOR_NO_DISPONIBLE: 'No se puede programar al conductor',
  RUTA_NO_DISPONIBLE: 'No se puede programar la ruta',

  // RF-18
  CONFLICTOS_ASIGNACION:
    'El conductor o el vehículo ya tienen otra programación en ese mismo día y horario.',
} as const;

export type TMensajeError = (typeof MensajesError)[keyof typeof MensajesError];
