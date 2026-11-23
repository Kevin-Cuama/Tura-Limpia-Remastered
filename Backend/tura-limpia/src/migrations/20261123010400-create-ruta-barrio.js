'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'ruta_barrio',
        {
          id_ruta_barrio: {
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
          id_barrio: {
            allowNull: false,
            type: Sequelize.INTEGER,
            references: { model: 'barrio', key: 'id_barrio' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        },
        { transaction },
      );

      // Una misma ruta no puede tener el mismo barrio dos veces.
      await queryInterface.addConstraint('ruta_barrio', {
        type: 'unique',
        fields: ['id_ruta', 'id_barrio'],
        name: 'ruta_barrio_id_ruta_id_barrio_unique',
        transaction,
      });
      await queryInterface.addIndex('ruta_barrio', ['id_barrio'], {
        name: 'ruta_barrio_id_barrio_idx',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ruta_barrio');
  },
};
