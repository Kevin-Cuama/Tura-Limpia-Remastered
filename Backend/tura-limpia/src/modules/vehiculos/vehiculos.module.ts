import { Module } from '@nestjs/common';
import { VehiculoController } from './controllers/vehiculo.controller.js';
import { VehiculoService } from './services/vehiculo.service.js';

@Module({
  controllers: [VehiculoController],
  providers: [VehiculoService],
})
export class VehiculosModule {}
