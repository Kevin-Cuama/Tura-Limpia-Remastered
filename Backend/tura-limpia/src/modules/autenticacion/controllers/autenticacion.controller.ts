import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdministradorGuard } from '../../../core/guards/administrador.guard.js';
import type { RequestAutenticado } from '../../../core/interfaces/payload-jwt.interface.js';
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

  // Necesita el token de la sesión que se va a cerrar.
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdministradorGuard)
  cerrarSesion(@Req() request: RequestAutenticado) {
    return this.autenticacionService.cerrarSesion(request.usuario);
  }
}
