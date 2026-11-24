import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from '../services/autenticacion.service.js';
import { JwtService } from '@nestjs/jwt';
import { ERoles } from '../../../core/interfaces/payload-jwt.interface.js';

describe('AutenticacionController', () => {
  let controller: AutenticacionController;
  let service: AutenticacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutenticacionController],
      providers: [
        {
          provide: AutenticacionService,
          useValue: {
            iniciarSesion: vi.fn().mockResolvedValue({
              mensaje: 'Bienvenido administrador',
              token: 'token_prueba',
            }),
            cerrarSesion: vi.fn().mockResolvedValue({
              mensaje: 'Sesión cerrada correctamente.',
            }),
          },
        },
        // El logout está protegido por AdministradorGuard, que usa JwtService.
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AutenticacionController>(AutenticacionController);
    service = module.get<AutenticacionService>(AutenticacionService);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('debe llamar a iniciarSesion con los parámetros correctos', async () => {
    const dto = { correo: 'admin@turalimpia.com', contrasena: 'Admin123*' };
    const iniciarSpy = vi.spyOn(service, 'iniciarSesion');
    const resultado = await controller.iniciarSesion(dto);

    expect(iniciarSpy).toHaveBeenCalledWith(dto.correo, dto.contrasena);
    expect(resultado).toEqual({
      mensaje: 'Bienvenido administrador',
      token: 'token_prueba',
    });
  });

  it('debe llamar a cerrarSesion y devolver la respuesta de confirmación', async () => {
    const cerrarSpy = vi.spyOn(service, 'cerrarSesion');
    const usuario = {
      idUsuario: 1,
      rol: ERoles.ADMINISTRADOR,
      jti: 'id-del-token',
    };
    const resultado = await controller.cerrarSesion({ usuario } as any);

    expect(cerrarSpy).toHaveBeenCalledWith(usuario);
    expect(resultado).toEqual({
      mensaje: 'Sesión cerrada correctamente.',
    });
  });
});
