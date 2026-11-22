import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AdministradorGuard } from './administrador.guard.js';
import { ERoles } from '../interfaces/payload-jwt.interface.js';
import { MensajesError } from '../constants/mensajes-error.js';

describe('AdministradorGuard', () => {
  let guard: AdministradorGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdministradorGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AdministradorGuard>(AdministradorGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('debe estar definido', () => {
    expect(guard).toBeDefined();
  });

  it('debe lanzar UnauthorizedException si no se proporciona el token', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException(MensajesError.TOKEN_NO_PROPORCIONADO),
    );
  });

  it('debe lanzar UnauthorizedException si el token es inválido o expiró', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token_invalido' },
        }),
      }),
    } as unknown as ExecutionContext;

    vi.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Token expirado'));

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException(MensajesError.TOKEN_INVALIDO_O_EXPIRADO),
    );
  });

  it('debe lanzar UnauthorizedException si el usuario NO tiene permisos de administrador', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization: 'Bearer token_valido' },
        }),
      }),
    } as unknown as ExecutionContext;

    vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
      idUsuario: 2,
      rol: 'USUARIO', // No es rol ADMINISTRADOR
    });

    await expect(guard.canActivate(mockContext)).rejects.toThrow(
      new UnauthorizedException(MensajesError.SIN_PERMISOS_ADMINISTRADOR),
    );
  });

  it('debe retornar true y asignar el usuario al request si es un administrador válido', async () => {
    const requestObj: any = {
      headers: { authorization: 'Bearer token_admin_valido' },
    };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => requestObj,
      }),
    } as unknown as ExecutionContext;

    const payloadAdmin = {
      idUsuario: 1,
      rol: ERoles.ADMINISTRADOR,
    };
    vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payloadAdmin);

    const resultado = await guard.canActivate(mockContext);
    expect(resultado).toBe(true);
    expect(requestObj.usuario).toEqual(payloadAdmin);
  });
});
