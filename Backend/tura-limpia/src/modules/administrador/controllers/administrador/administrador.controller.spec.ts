import { Test, TestingModule } from '@nestjs/testing';
import { AdministradorController } from './administrador.controller.js';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../../services/administrador/administrador.service.js';
import { vi } from 'vitest';

describe('AdministradorController', () => {
  let controller: AdministradorController;
  const servicio = { obtenerPerfil: vi.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministradorController],
      providers: [
        { provide: AdministradorService, useValue: servicio },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AdministradorController>(AdministradorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('el perfil solo debe mostrar id, nombre y correo', async () => {
    const datosBD = {
      id: 1,
      nombre: 'Admin Prueba',
      correo: 'admin@turalimpia.com',
      contrasena: '$2b$10$hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    servicio.obtenerPerfil.mockResolvedValue({ get: () => datosBD });

    const respuesta = await controller.perfil({
      usuario: { idUsuario: 1 },
    } as never);

    expect(servicio.obtenerPerfil).toHaveBeenCalledWith(1);
    expect(respuesta).toEqual({
      id: 1,
      nombre: 'Admin Prueba',
      correo: 'admin@turalimpia.com',
    });
  });
});
