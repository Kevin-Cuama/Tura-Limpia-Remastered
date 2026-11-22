import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { IniciarSesionDto } from '../dtos/iniciar-sesion.dto.js';
import { AutenticacionService } from '../services/autenticacion.service.js';

@Controller('api/v1')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  iniciarSesion(@Body() parametros: IniciarSesionDto) {
    return this.autenticacionService.iniciarSesion(
      parametros.correo,
      parametros.contrasena,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  cerrarSesion() {
    return this.autenticacionService.cerrarSesion();
  }
}
