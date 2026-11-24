import { Injectable, NotFoundException } from '@nestjs/common';
import { AdministradorRepository } from '../../repositories/administrador.repository.js';
import { MensajesError } from '../../../../core/constants/mensajes-error.js';

@Injectable()
export class AdministradorService {
  async obtenerPerfil(id: number) {
    const administrador = await AdministradorRepository.buscarPorId(id);
    if (!administrador) {
      throw new NotFoundException(MensajesError.ADMINISTRADOR_NO_ENCONTRADO);
    }
    return administrador;
  }
}
