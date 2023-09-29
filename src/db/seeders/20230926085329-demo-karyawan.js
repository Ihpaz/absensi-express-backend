'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('mskaryawan', [{
      nama: 'ihpaz',
      email:'ihpaz@gmail.com',
      nohp:'0923871',
      password:'$2b$10$.wVAIRnpOPjaRWDgzDWV4.Yghw4iJ.iKoqrIo/Wv4osjL.CkhlTZC',
      foto:'ihpaz@gmail.com-ihpaz.jpg',
      PosisiId:2,
      RoleId:2
    },{
      nama: 'andi',
      email:'andi@gmail.com',
      nohp:'0923871',
      password:'$2b$10$0s4gPeLAX3aY9VKwfY8ajuMhomEl6/MtMs.9lTOupl.B59Yu2U.Ya',
      foto:'andi@gmail.com-andi.jpg',
      PosisiId:1,
      RoleId:1
    },
    {
      nama: 'ana',
      email:'ana@gmail.com',
      nohp:'0923871',
      password:'$2b$10$ft0/RN.pbgCoLgQMbxgH4ewo6BOGgc86Y06vbGVu9R..8yM/N0Lmm',
      foto:'ana@gmail.com-ana.jpg',
      PosisiId:3,
      RoleId:2
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('mskaryawan', null, {});
  }
};
