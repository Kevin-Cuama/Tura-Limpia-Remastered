'use strict';

/**
 * Regla de integridad 5 del modelo entidad-relación: el correo del
 * administrador debe ser único. La migración inicial de la tabla no lo
 * aplicaba, por eso se agrega en una migración aparte.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('administrador', {
      type: 'unique',
      fields: ['correo'],
      name: 'administrador_correo_unique',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'administrador',
      'administrador_correo_unique',
    );
  },
};
