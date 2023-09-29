'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('msposisi', [{
      posisi: 'Admin HR'
    },{
      posisi: 'Staff IT'
    },
    {
      posisi: 'Staff Accounting'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('msposisi', null, {});
  }
};
