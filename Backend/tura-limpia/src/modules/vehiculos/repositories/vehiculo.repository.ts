import { Op, WhereOptions } from 'sequelize';
import { limiteYDesplazamiento } from '../../../core/dtos/paginacion.dto.js';
import { ListarVehiculosDto } from '../dtos/vehiculo.dto.js';
import { Vehiculo } from '../models/vehiculo.model.js';

export class VehiculoRepository {
  static listar(filtros: ListarVehiculosDto) {
    const where: WhereOptions = {};
    if (filtros.buscar) {
      const texto = `%${filtros.buscar.trim()}%`;
      Object.assign(where, {
        [Op.or]: [
          { placa: { [Op.iLike]: texto } },
          { marca: { [Op.iLike]: texto } },
          { modelo: { [Op.iLike]: texto } },
        ],
      });
    }
    if (filtros.estadoOperativo) Object.assign(where, { estadoOperativo: filtros.estadoOperativo });
    if (filtros.activo !== undefined) Object.assign(where, { activo: filtros.activo });

    return Vehiculo.findAndCountAll({
      where,
      order: [['placa', 'ASC']],
      ...limiteYDesplazamiento(filtros),
    });
  }

  static buscarPorId(id: number) {
    return Vehiculo.findByPk(id);
  }

  /** Busca otra placa igual (sin contar el vehículo que se está editando). */
  static buscarPorPlaca(placa: string, excluirId?: number) {
    return Vehiculo.findOne({
      where: { placa, ...(excluirId ? { id: { [Op.ne]: excluirId } } : {}) },
    });
  }

  static crear(datos: Partial<Vehiculo>) {
    return Vehiculo.create(datos);
  }
}
