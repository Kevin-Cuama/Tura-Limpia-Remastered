'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'conductor',
        {
          id_conductor: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          nombres: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },
          apellidos: {
            allowNull: false,
            type: Sequelize.STRING(100),
          },
          numero_documento: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(20),
          },
          numero_licencia: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(20),
          },
          categoria_licencia: {
            allowNull: false,
            type: Sequelize.STRING(2),
          },
          vencimiento_licencia: {
            allowNull: false,
            type: Sequelize.DATEONLY,
          },
          estado: {
            allowNull: false,
            defaultValue: 'ACTIVO',
            type: Sequelize.STRING(10),
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

      // Categorías de licencia de conducción vigentes en Colombia.
      await queryInterface.sequelize.query(
        `ALTER TABLE conductor
           ADD CONSTRAINT conductor_categoria_licencia_check
             CHECK (categoria_licencia IN ('A1', 'A2', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3')),
           ADD CONSTRAINT conductor_estado_check
             CHECK (estado IN ('ACTIVO', 'INACTIVO'))`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('conductor');
  },
};
