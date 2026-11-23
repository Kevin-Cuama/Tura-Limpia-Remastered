'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'barrio',
        {
          id_barrio: {
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
            type: Sequelize.STRING(255),
          },
        },
        { transaction },
      );

      // El nombre no se repite aunque cambien las mayúsculas ("La Playita" = "la playita").
      await queryInterface.sequelize.query(
        'CREATE UNIQUE INDEX barrio_nombre_unique ON barrio (LOWER(nombre))',
        { transaction },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('barrio');
  },
};
