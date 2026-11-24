import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module.js';
import { AutenticacionModule } from './modules/autenticacion/autenticacion.module.js';
import { AdministradorModule } from './modules/administrador/administrador.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    AutenticacionModule,
    AdministradorModule
  ]
})
export class AppModule {}
