import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AutenticacionService } from './autenticacion.service.js';
import { AdministradorRepository } from '../../administrador/repositories/administrador.repository.js';
import { MensajesError } from '../../../core/constants/mensajes-error.js';

describe('AutenticacionService', () => {
  let service: AutenticacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutenticacionService,
        {
          provide: JwtService,
          useValue: {
            signAsync: vi.fn().mockResolvedValue('token_falso_jwt'),
          },
        },
      ],
    }).compile();

    service = module.get<AutenticacionService>(AutenticacionService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe lanzar UnauthorizedException con CREDENCIALES_INVALIDAS si el usuario no existe', async () => {
    vi.spyOn(AdministradorRepository, 'buscarPorCorreo').mockResolvedValue(null as any);

    await expect(
      service.iniciarSesion('noexiste@turalimpia.com', '123456'),
    ).rejects.toThrow(new UnauthorizedException(MensajesError.CREDENCIALES_INVALIDAS));
  });
});
