'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('trabsen', [{
      tglkerja: '2023-09-26',
      tglabsenmasuk:'2023-09-26 07:10',
      tglabsenpulang:'2023-09-26 17:10',
      KaryawanId:1,
    },{
      tglkerja: '2023-09-27',
      tglabsenmasuk:'2023-09-27 08:10',
      tglabsenpulang:'2023-09-27 18:10',
      KaryawanId:1,
    },
    {
      tglkerja: '2023-09-27',
      tglabsenmasuk:'2023-09-27 08:10',
      tglabsenpulang:'2023-09-27 18:10',
      KaryawanId:3,
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('trabsen', null, {});
  }
};
