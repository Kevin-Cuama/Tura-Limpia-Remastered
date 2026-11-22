import { Test, TestingModule } from '@nestjs/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from '../services/autenticacion.service.js';

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
            cerrarSesion: vi.fn().mockReturnValue({
              mensaje: 'Sesión cerrada correctamente.',
            }),
          },
        },
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

  it('debe llamar a cerrarSesion y devolver la respuesta de confirmación', () => {
    const cerrarSpy = vi.spyOn(service, 'cerrarSesion');
    const resultado = controller.cerrarSesion();

    expect(cerrarSpy).toHaveBeenCalled();
    expect(resultado).toEqual({
      mensaje: 'Sesión cerrada correctamente.',
    });
  });
});
