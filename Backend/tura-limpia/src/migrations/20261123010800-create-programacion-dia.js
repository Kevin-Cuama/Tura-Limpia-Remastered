'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'programacion_dia',
        {
          id_programacion_dia: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          id_programacion: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: { model: 'programacion', key: 'id_programacion' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          dia_semana: {
            allowNull: false,
            type: Sequelize.STRING(10),
          },
        },
        { transaction },
      );

      // Una programación no puede repetir el mismo día de la semana.
      await queryInterface.addConstraint('programacion_dia', {
        type: 'unique',
        fields: ['id_programacion', 'dia_semana'],
        name: 'programacion_dia_id_programacion_dia_semana_unique',
        transaction,
      });
      await queryInterface.sequelize.query(
        `ALTER TABLE programacion_dia
           ADD CONSTRAINT programacion_dia_dia_semana_check
             CHECK (dia_semana IN ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'))`,
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('programacion_dia');
  },
};
