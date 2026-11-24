import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AdministradorService } from './administrador.service.js';
import { AdministradorRepository } from '../../repositories/administrador.repository.js';
import { MensajesError } from '../../../../core/constants/mensajes-error.js';

describe('AdministradorService', () => {
  let service: AdministradorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministradorService],
    }).compile();

    service = module.get<AdministradorService>(AdministradorService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe retornar el perfil si el administrador existe', async () => {
    const adminMock = { id: 1, nombre: 'Admin Prueba', correo: 'admin@turalimpia.com' };
    vi.spyOn(AdministradorRepository, 'buscarPorId').mockResolvedValue(adminMock as any);

    const resultado = await service.obtenerPerfil(1);
    expect(resultado).toEqual(adminMock);
  });

  it('debe lanzar NotFoundException si el administrador no existe', async () => {
    vi.spyOn(AdministradorRepository, 'buscarPorId').mockResolvedValue(null as any);

    await expect(service.obtenerPerfil(999)).rejects.toThrow(
      new NotFoundException(MensajesError.ADMINISTRADOR_NO_ENCONTRADO),
    );
  });
});
