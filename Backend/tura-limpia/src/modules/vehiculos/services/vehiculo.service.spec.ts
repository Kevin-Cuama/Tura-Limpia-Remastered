import { ConflictException, NotFoundException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MensajesError } from '../../../core/constants/mensajes-error.js';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';
import { VehiculoService } from './vehiculo.service.js';

/** Vehículo falso: guarda los cambios de update() en el mismo objeto. */
function vehiculoFalso(datos: Record<string, unknown> = {}) {
  const v: Record<string, unknown> = {
    id: 1,
    placa: 'TLA101',
    marca: 'Chevrolet',
    modelo: 'NPR',
    capacidad: 8,
    estadoOperativo: 'DISPONIBLE',
    activo: true,
    ...datos,
  };
  v.update = vi.fn(async (cambios: object) => Object.assign(v, cambios));
  return v as never;
}

describe('VehiculoService (RF-05, RF-06)', () => {
  const servicio = new VehiculoService();
  afterEach(() => vi.restoreAllMocks());

  it('registra un vehículo nuevo como activo y disponible', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorPlaca').mockResolvedValue(null);
    const crear = vi.spyOn(VehiculoRepository, 'crear').mockResolvedValue(vehiculoFalso());

    await servicio.crear({ placa: 'TLA101', marca: 'Chevrolet', modelo: 'NPR', capacidad: 8 });

    expect(crear).toHaveBeenCalledWith(
      expect.objectContaining({ activo: true, estadoOperativo: 'DISPONIBLE' }),
    );
  });

  it('no permite registrar una placa repetida', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorPlaca').mockResolvedValue(vehiculoFalso());
    await expect(
      servicio.crear({ placa: 'TLA101', marca: 'X', modelo: 'Y', capacidad: 1 }),
    ).rejects.toThrow(new ConflictException(MensajesError.PLACA_REPETIDA));
  });

  it('al editar, revisa que la placa nueva no la tenga otro vehículo', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorId').mockResolvedValue(vehiculoFalso());
    const buscarPlaca = vi
      .spyOn(VehiculoRepository, 'buscarPorPlaca')
      .mockResolvedValue(vehiculoFalso({ id: 2 }));

    await expect(servicio.actualizar(1, { placa: 'TLA102' })).rejects.toThrow(ConflictException);
    expect(buscarPlaca).toHaveBeenCalledWith('TLA102', 1);
  });

  it('responde 404 si el vehículo no existe', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorId').mockResolvedValue(null);
    await expect(servicio.obtener(99)).rejects.toThrow(
      new NotFoundException(MensajesError.VEHICULO_NO_ENCONTRADO),
    );
  });

  it('cambia el estado operativo de un vehículo activo', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorId').mockResolvedValue(vehiculoFalso());
    const r = await servicio.cambiarEstado(1, 'MANTENIMIENTO');
    expect(r.estadoOperativo).toBe('MANTENIMIENTO');
  });

  it('no cambia el estado de un vehículo desactivado', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorId').mockResolvedValue(
      vehiculoFalso({ activo: false, estadoOperativo: 'FUERA_DE_SERVICIO' }),
    );
    await expect(servicio.cambiarEstado(1, 'DISPONIBLE')).rejects.toThrow(
      new ConflictException(MensajesError.VEHICULO_INACTIVO_SIN_ESTADO),
    );
  });

  it('desactivar deja el vehículo fuera de servicio y activar lo deja disponible', async () => {
    vi.spyOn(VehiculoRepository, 'buscarPorId').mockResolvedValue(vehiculoFalso());
    const desactivado = await servicio.desactivar(1);
    expect(desactivado).toMatchObject({ activo: false, estadoOperativo: 'FUERA_DE_SERVICIO' });

    const activado = await servicio.activar(1);
    expect(activado).toMatchObject({ activo: true, estadoOperativo: 'DISPONIBLE' });
  });
});
