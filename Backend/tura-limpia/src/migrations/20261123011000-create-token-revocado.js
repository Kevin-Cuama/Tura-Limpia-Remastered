'use strict';

/**
 * Tabla técnica para el cierre de sesión (RF-02): guarda los tokens de las
 * sesiones cerradas hasta que vencen. No forma parte del modelo entidad-relación.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('token_revocado', {
      jti: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
      },
      expira_en: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('token_revocado', ['expira_en'], {
      name: 'token_revocado_expira_en_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('token_revocado');
  },
};
