import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { Config } from '../../configs/configuracion.js';
import { AutenticacionController } from './controllers/autenticacion.controller.js';
import { AutenticacionService } from './services/autenticacion.service.js';

if (!Config.jwtSecret) {
  throw new Error('Falta la variable JWT_SECRET en el archivo .env');
}

@Module({
  imports: [
    // global: el JwtService queda disponible para los guards de cualquier módulo
    JwtModule.register({
      global: true,
      secret: Config.jwtSecret,
      signOptions: { expiresIn: Config.jwtExpiresIn as StringValue },
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
})
export class AutenticacionModule {}
