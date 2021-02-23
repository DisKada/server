'use strict';
const {hashPassword} = require('../helpers/bcrypt')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let dataAdmin = require('../user_admin.json');
    dataAdmin.forEach((e) => {
      e.password = hashPassword(e.password);
      e.createdAt = new Date();
      e.updatedAt = new Date();
   });
   await queryInterface.bulkInsert('Users', dataAdmin, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
