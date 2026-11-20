import { Administrador } from '../models/administrador.model.js';

export class AdministradorRepository {
  static buscarPorCorreo(correo: string) {
    return Administrador.findOne({ where: { correo } });
  }

  static buscarPorId(id: number) {
    return Administrador.findByPk(id, {
      attributes: { exclude: ['contrasena'] },
    });
  }
}
