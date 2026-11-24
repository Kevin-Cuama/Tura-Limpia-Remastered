import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdministradorGuard } from '../../../../core/guards/administrador.guard.js';
import type { RequestAutenticado } from '../../../../core/interfaces/payload-jwt.interface.js';
import { AdministradorService } from '../../services/administrador/administrador.service.js';
import { aRespuesta } from '../../../../core/utils/respuesta.util.js';
import { PerfilAdministradorDto } from '../../dtos/perfil-administrador.dto.js';

@Controller('api/v1/administrador')
@UseGuards(AdministradorGuard)
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  // Ruta protegida: solo responde con un token de administrador válido
  @Get('perfil')
  async perfil(
    @Req() request: RequestAutenticado,
  ): Promise<PerfilAdministradorDto> {
    const administrador = await this.administradorService.obtenerPerfil(
      request.usuario.idUsuario,
    );
    // El modelo de Sequelize se pasa a objeto plano antes de convertirlo al DTO.
    return aRespuesta(
      PerfilAdministradorDto,
      administrador.get({ plain: true }),
    );
  }
}
