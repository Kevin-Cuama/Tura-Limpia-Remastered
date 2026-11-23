import { Expose } from 'class-transformer';

/**
 * Respuesta del perfil del administrador. Solo salen en el JSON los campos
 * con `@Expose()`; la contraseña, `createdAt` y `updatedAt` quedan ocultos.
 */
export class PerfilAdministradorDto {
  @Expose()
  id: number;

  @Expose()
  nombre: string;

  @Expose()
  correo: string;
}
