import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * Convierte los datos que devuelve el servicio al DTO de respuesta.
 *
 * Solo se incluyen los campos marcados con `@Expose()` en el DTO; todo lo
 * demás (por ejemplo `createdAt` y `updatedAt`) queda por fuera del JSON.
 */
export function aRespuesta<T, V>(dto: ClassConstructor<T>, datos: V): T {
  return plainToInstance(dto, datos, { excludeExtraneousValues: true }) as T;
}
