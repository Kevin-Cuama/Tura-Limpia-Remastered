'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'punto_ruta',
        {
          id_punto: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          id_ruta: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: { model: 'ruta', key: 'id_ruta' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          orden: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          latitud: {
            allowNull: false,
            type: Sequelize.DECIMAL(10, 7),
          },
          longitud: {
            allowNull: false,
            type: Sequelize.DECIMAL(10, 7),
          },
          referencia: {
            allowNull: true,
            type: Sequelize.STRING(255),
          },
        },
        { transaction },
      );

      // Una ruta no puede tener dos puntos con el mismo número de orden.
      await queryInterface.addConstraint('punto_ruta', {
        type: 'unique',
        fields: ['id_ruta', 'orden'],
        name: 'punto_ruta_id_ruta_orden_unique',
        transaction,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE punto_ruta
           ADD CONSTRAINT punto_ruta_orden_check CHECK (orden >= 1),
           ADD CONSTRAINT punto_ruta_latitud_check CHECK (latitud BETWEEN -90 AND 90),
           ADD CONSTRAINT punto_ruta_longitud_check CHECK (longitud BETWEEN -180 AND 180)`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('punto_ruta');
  },
};
