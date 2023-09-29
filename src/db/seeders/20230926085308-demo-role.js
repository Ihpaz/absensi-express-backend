'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('msrole', [{
      role: 'admin'
    },{
      role: 'staff'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('msrole', null, {});
  }
};
