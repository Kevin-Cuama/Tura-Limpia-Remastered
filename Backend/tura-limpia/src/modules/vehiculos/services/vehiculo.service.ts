import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { MensajesError } from '../../../core/constants/mensajes-error.js';
import { paginar } from '../../../core/dtos/paginacion.dto.js';
import {
  ActualizarVehiculoDto,
  CrearVehiculoDto,
  ListarVehiculosDto,
  VehiculoRespuesta,
} from '../dtos/vehiculo.dto.js';
import { EstadoVehiculo, Vehiculo } from '../models/vehiculo.model.js';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';

export function aVehiculoRespuesta(v: Vehiculo): VehiculoRespuesta {
  return {
    id: v.id,
    placa: v.placa,
    marca: v.marca,
    modelo: v.modelo,
    capacidad: v.capacidad,
    estadoOperativo: v.estadoOperativo,
    activo: v.activo,
    creadoEn: v.createdAt,
    actualizadoEn: v.updatedAt,
  };
}

/**
 * Gestión de vehículos (RF-05) y de su estado operativo (RF-06).
 *
 * Regla del proyecto: un vehículo desactivado queda "fuera de servicio" y no
 * se le puede cambiar el estado hasta que se active otra vez. Así los
 * indicadores del dashboard siempre suman el total.
 */
@Injectable()
export class VehiculoService {
  async listar(filtros: ListarVehiculosDto) {
    const { rows, count } = await VehiculoRepository.listar(filtros);
    return paginar(rows.map(aVehiculoRespuesta), count, filtros);
  }

  async obtener(id: number) {
    return aVehiculoRespuesta(await this.buscar(id));
  }

  async crear(datos: CrearVehiculoDto) {
    await this.validarPlacaLibre(datos.placa);
    const vehiculo = await VehiculoRepository.crear({
      ...datos,
      estadoOperativo: datos.estadoOperativo ?? 'DISPONIBLE',
      activo: true,
    });
    return aVehiculoRespuesta(vehiculo);
  }

  async actualizar(id: number, datos: ActualizarVehiculoDto) {
    const vehiculo = await this.buscar(id);
    if (datos.placa && datos.placa !== vehiculo.placa) {
      await this.validarPlacaLibre(datos.placa, id);
    }
    if (datos.estadoOperativo && datos.estadoOperativo !== vehiculo.estadoOperativo) {
      this.validarQueEsteActivo(vehiculo);
    }
    await vehiculo.update(datos);
    return aVehiculoRespuesta(vehiculo);
  }

  async cambiarEstado(id: number, estadoOperativo: EstadoVehiculo) {
    const vehiculo = await this.buscar(id);
    this.validarQueEsteActivo(vehiculo);
    await vehiculo.update({ estadoOperativo });
    return aVehiculoRespuesta(vehiculo);
  }

  async desactivar(id: number) {
    const vehiculo = await this.buscar(id);
    await vehiculo.update({ activo: false, estadoOperativo: 'FUERA_DE_SERVICIO' });
    return aVehiculoRespuesta(vehiculo);
  }

  async activar(id: number) {
    const vehiculo = await this.buscar(id);
    if (!vehiculo.activo) {
      await vehiculo.update({ activo: true, estadoOperativo: 'DISPONIBLE' });
    }
    return aVehiculoRespuesta(vehiculo);
  }

  private async buscar(id: number) {
    const vehiculo = await VehiculoRepository.buscarPorId(id);
    if (!vehiculo) throw new NotFoundException(MensajesError.VEHICULO_NO_ENCONTRADO);
    return vehiculo;
  }

  private async validarPlacaLibre(placa: string, excluirId?: number) {
    if (await VehiculoRepository.buscarPorPlaca(placa, excluirId)) {
      throw new ConflictException(MensajesError.PLACA_REPETIDA);
    }
  }

  private validarQueEsteActivo(vehiculo: Vehiculo) {
    if (!vehiculo.activo) {
      throw new ConflictException(MensajesError.VEHICULO_INACTIVO_SIN_ESTADO);
    }
  }
}
