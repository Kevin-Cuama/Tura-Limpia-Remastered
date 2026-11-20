import { Injectable, NotFoundException } from '@nestjs/common';
import { AdministradorRepository } from '../../repositories/administrador.repository.js';

@Injectable()
export class AdministradorService {
  async obtenerPerfil(id: number) {
    const administrador = await AdministradorRepository.buscarPorId(id);
    if (!administrador) {
      throw new NotFoundException('Administrador no encontrado.');
    }
    return administrador;
  }
}
