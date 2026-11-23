'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'vehiculo',
        {
          id_vehiculo: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          placa: {
            allowNull: false,
            unique: true,
            type: Sequelize.STRING(10),
          },
          marca: {
            allowNull: false,
            type: Sequelize.STRING(50),
          },
          modelo: {
            allowNull: false,
            type: Sequelize.STRING(50),
          },
          capacidad: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          estado_operativo: {
            allowNull: false,
            defaultValue: 'DISPONIBLE',
            type: Sequelize.STRING(20),
          },
          activo: {
            allowNull: false,
            defaultValue: true,
            type: Sequelize.BOOLEAN,
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
        `ALTER TABLE vehiculo
           ADD CONSTRAINT vehiculo_capacidad_check CHECK (capacidad > 0),
           ADD CONSTRAINT vehiculo_estado_operativo_check
             CHECK (estado_operativo IN ('DISPONIBLE', 'EN_SERVICIO', 'MANTENIMIENTO', 'FUERA_DE_SERVICIO'))`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vehiculo');
  },
};
