'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'turno',
        {
          id_turno: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          nombre: {
            allowNull: false,
            type: Sequelize.STRING(50),
          },
          hora_inicio: {
            allowNull: false,
            type: Sequelize.TIME,
          },
          hora_fin: {
            allowNull: false,
            type: Sequelize.TIME,
          },
        },
        { transaction },
      );

      // RF-14: la hora de finalización debe ser posterior a la hora de inicio.
      await queryInterface.sequelize.query(
        `ALTER TABLE turno
           ADD CONSTRAINT turno_horario_check CHECK (hora_fin > hora_inicio)`,
        { transaction },
      );

      // Dos turnos no pueden llamarse igual, sin importar mayúsculas.
      await queryInterface.sequelize.query(
        'CREATE UNIQUE INDEX turno_nombre_unique ON turno (LOWER(nombre))',
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('turno');
  },
};
