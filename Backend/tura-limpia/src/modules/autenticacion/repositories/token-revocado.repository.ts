import { Op } from 'sequelize';
import { TokenRevocado } from '../models/token-revocado.model.js';

export class TokenRevocadoRepository {
  /** Guarda el token cerrado y de paso borra los que ya vencieron. */
  static async revocar(jti: string, expiraEn: Date): Promise<void> {
    await TokenRevocado.destroy({
      where: { expiraEn: { [Op.lt]: new Date() } },
    });
    await TokenRevocado.findOrCreate({
      where: { jti },
      defaults: { jti, expiraEn },
    });
  }

  static async estaRevocado(jti: string): Promise<boolean> {
    return (await TokenRevocado.count({ where: { jti } })) > 0;
  }
}
