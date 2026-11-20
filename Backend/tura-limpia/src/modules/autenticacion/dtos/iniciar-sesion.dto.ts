import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class IniciarSesionDto {
  @IsEmail({}, { message: 'El correo no es válido.' })
  correo: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  contrasena: string;
}
