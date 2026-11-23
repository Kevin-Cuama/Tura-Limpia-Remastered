'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'ruta',
        {
          id_ruta: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          nombre: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },
          descripcion: {
            allowNull: true,
            type: Sequelize.TEXT,
          },
          tipo_servicio: {
            allowNull: false,
            type: Sequelize.STRING(50),
          },
          estado: {
            allowNull: false,
            defaultValue: 'ACTIVA',
            type: Sequelize.STRING(15),
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE ruta
           ADD CONSTRAINT ruta_estado_check CHECK (estado IN ('ACTIVA', 'SUSPENDIDA'))`,
        { transaction },
      );

      // Dos rutas no pueden llamarse igual, sin importar mayúsculas.
      await queryInterface.sequelize.query(
        'CREATE UNIQUE INDEX ruta_nombre_unique ON ruta (LOWER(nombre))',
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ruta');
  },
};
