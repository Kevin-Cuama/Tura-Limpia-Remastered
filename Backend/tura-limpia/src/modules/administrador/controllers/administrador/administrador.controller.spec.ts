import { Test, TestingModule } from '@nestjs/testing';
import { AdministradorController } from './administrador.controller.js';
import { JwtService } from '@nestjs/jwt';
import { AdministradorService } from '../../services/administrador/administrador.service.js';

describe('AdministradorController', () => {
  let controller: AdministradorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministradorController],
      providers: [
        { provide: AdministradorService, useValue: {} },
        { provide: JwtService, useValue: {} },
      ],
    }).compile();

    controller = module.get<AdministradorController>(AdministradorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
