import { Config } from '../../../configs/configuracion.js';
import { Sequelize } from 'sequelize-typescript';

export const models = [];

export const TURADB= {
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
    return sequelize;
  },
};
