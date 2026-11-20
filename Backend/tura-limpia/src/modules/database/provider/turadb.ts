
import { Config } from '../../../configs/configuracion.js';
import { Sequelize } from 'sequelize-typescript';

import { Administrador } from '../../administrador/models/administrador.model.js';

export const models = [Administrador];

export const TURADB = {
  provide: 'SEQUELIZE_CITAS',
  useFactory: async () => {
    const sequelize = new Sequelize({
      dialect: 'postgres',
      dialectOptions: {
        multipleStatements: true,
        useUTC: false,
        dateStrings: true,
        typeCast: true,
      },
      timezone: 'America/Bogota',
      host: Config.dbHost,
      port: Config.dbPuerto,
      username: Config.dbUsuario,
      password: Config.dbContrasenna,
      database: Config.dbBaseDatos,
    });

    sequelize.addModels(models);

    // Verificar la conexión real con PostgreSQL
    try {
      await sequelize.authenticate();

      console.log('Conexión exitosa con PostgreSQL');
      console.log('Base de datos:', Config.dbBaseDatos);
    } catch (error) {
      console.error('Error al conectar con PostgreSQL:', error);
      throw error;
    }

    return sequelize;
  },
};

