import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdministradorGuard } from '../../../../core/guards/administrador.guard.js';
import type { RequestAutenticado } from '../../../../core/interfaces/payload-jwt.interface.js';
import { AdministradorService } from '../../services/administrador/administrador.service.js';

@Controller('api/v1/administrador')
@UseGuards(AdministradorGuard)
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  // Ruta protegida: solo responde con un token de administrador válido
  @Get('perfil')
  perfil(@Req() request: RequestAutenticado) {
    return this.administradorService.obtenerPerfil(request.usuario.idUsuario);
  }
}
