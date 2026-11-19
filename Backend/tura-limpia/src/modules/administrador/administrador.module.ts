import { Module } from '@nestjs/common';
import { AdministradorController } from './controllers/administrador/administrador.controller.js';
import { AdministradorService } from './services/administrador/administrador.service.js';

@Module({
  controllers: [AdministradorController],
  providers: [AdministradorService]
})
export class AdministradorModule {}
