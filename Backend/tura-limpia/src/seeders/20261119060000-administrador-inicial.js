'use strict';

require('dotenv').config();
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const correo = process.env.ADMIN_CORREO;
    const contrasena = process.env.ADMIN_CONTRASENA;
    if (!correo || !contrasena) {
      throw new Error('Define ADMIN_CORREO y ADMIN_CONTRASENA en el .env');
    }

    const [existentes] = await queryInterface.sequelize.query(
      'SELECT id FROM administrador WHERE correo = :correo',
      { replacements: { correo } },
    );
    if (existentes.length > 0) {
      console.log(`El administrador ${correo} ya existe, no se crea de nuevo.`);
      return;
    }

    const saltos = Number(process.env.BCRYPT_SALTOS ?? 10);
    await queryInterface.bulkInsert('administrador', [
      {
        nombre: process.env.ADMIN_NOMBRE ?? 'Administrador',
        correo,
        contrasena: await bcrypt.hash(contrasena, saltos),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('administrador', {
      correo: process.env.ADMIN_CORREO,
    });
  },
};
