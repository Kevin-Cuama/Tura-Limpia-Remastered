'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const referencia = (tabla, llave) => ({
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: tabla, key: llave },
      onUpdate: 'CASCADE',
      // No se puede borrar un recurso que tenga programaciones asociadas.
      onDelete: 'RESTRICT',
    });

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'programacion',
        {
          id_programacion: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          id_ruta: referencia('ruta', 'id_ruta'),
          id_vehiculo: referencia('vehiculo', 'id_vehiculo'),
          id_conductor: referencia('conductor', 'id_conductor'),
          id_turno: referencia('turno', 'id_turno'),
          fecha: {
            allowNull: false,
            type: Sequelize.DATEONLY,
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
        `ALTER TABLE programacion
           ADD CONSTRAINT programacion_estado_check
             CHECK (estado IN ('ACTIVA', 'CANCELADA', 'DESACTIVADA'))`,
        { transaction },
      );

      for (const campo of [
        'id_ruta',
        'id_vehiculo',
        'id_conductor',
        'id_turno',
        'fecha',
      ]) {
        await queryInterface.addIndex('programacion', [campo], {
          name: `programacion_${campo}_idx`,
          transaction,
        });
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('programacion');
  },
};
