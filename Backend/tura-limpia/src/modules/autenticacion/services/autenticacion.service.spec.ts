import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { AutenticacionService } from './autenticacion.service.js';
import { AdministradorRepository } from '../../administrador/repositories/administrador.repository.js';
import { MensajesError } from '../../../core/constants/mensajes-error.js';
import { ERoles } from '../../../core/interfaces/payload-jwt.interface.js';
import { TokenRevocadoRepository } from '../repositories/token-revocado.repository.js';

describe('AutenticacionService', () => {
  let service: AutenticacionService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacionService,
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn().mockResolvedValue('token_falso_jwt_firmado'),
          },
        },
      ],
    }).compile();

    service = module.get<AutenticacionService>(AutenticacionService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe lanzar UnauthorizedException con CREDENCIALES_INVALIDAS si el correo no existe', async () => {
    vi.spyOn(AdministradorRepository, 'buscarPorCorreo').mockResolvedValue(
      null as any,
    );

    await expect(
      service.iniciarSesion('noexiste@turalimpia.com', '123456'),
    ).rejects.toThrow(
      new UnauthorizedException(MensajesError.CREDENCIALES_INVALIDAS),
    );
  });

  it('debe lanzar UnauthorizedException con CREDENCIALES_INVALIDAS si la contraseña no coincide', async () => {
    const adminMock = {
      id: 1,
      nombre: 'Admin Prueba',
      correo: 'admin@turalimpia.com',
      contrasena: 'hash_guardado',
    };
    vi.spyOn(AdministradorRepository, 'buscarPorCorreo').mockResolvedValue(
      adminMock as any,
    );
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    await expect(
      service.iniciarSesion('admin@turalimpia.com', 'clave_erronea'),
    ).rejects.toThrow(
      new UnauthorizedException(MensajesError.CREDENCIALES_INVALIDAS),
    );
  });

  it('debe iniciar sesión con éxito y retornar el token y datos del administrador', async () => {
    const adminMock = {
      id: 1,
      nombre: 'Admin Prueba',
      correo: 'admin@turalimpia.com',
      contrasena: 'hash_guardado',
    };
    vi.spyOn(AdministradorRepository, 'buscarPorCorreo').mockResolvedValue(
      adminMock as any,
    );
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const signSpy = vi
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue('token_falso_jwt_firmado');

    const respuesta = await service.iniciarSesion(
      'admin@turalimpia.com',
      'Admin123*',
    );

    expect(respuesta).toEqual({
      mensaje: 'Bienvenido administrador',
      token: 'token_falso_jwt_firmado',
      administrador: {
        id: 1,
        nombre: 'Admin Prueba',
        correo: 'admin@turalimpia.com',
      },
    });
    expect(signSpy).toHaveBeenCalledWith(
      { idUsuario: 1, rol: ERoles.ADMINISTRADOR },
      { jwtid: expect.any(String) },
    );
  });

  it('debe cerrar sesión correctamente y retornar mensaje de confirmación', async () => {
    const revocar = vi
      .spyOn(TokenRevocadoRepository, 'revocar')
      .mockResolvedValue();
    const respuesta = await service.cerrarSesion({
      idUsuario: 1,
      rol: ERoles.ADMINISTRADOR,
      jti: 'id-del-token',
      exp: 1_800_000_000,
    });
    expect(respuesta).toEqual({
      mensaje: 'Sesión cerrada correctamente.',
    });
    // RF-02: el token queda guardado como cerrado hasta su vencimiento
    expect(revocar).toHaveBeenCalledWith(
      'id-del-token',
      new Date(1_800_000_000 * 1000),
    );
  });

  it('cada inicio de sesión debe generar un identificador de token distinto', async () => {
    const adminMock = { id: 1, nombre: 'A', correo: 'a@b.co', contrasena: 'h' };
    vi.spyOn(AdministradorRepository, 'buscarPorCorreo').mockResolvedValue(
      adminMock as any,
    );
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
    const signSpy = vi.spyOn(jwtService, 'signAsync').mockResolvedValue('t');

    await service.iniciarSesion('a@b.co', 'x');
    await service.iniciarSesion('a@b.co', 'x');

    const [primero, segundo] = signSpy.mock.calls.map(
      (llamada) => llamada[1]?.jwtid,
    );
    expect(primero).not.toBe(segundo);
  });
});
