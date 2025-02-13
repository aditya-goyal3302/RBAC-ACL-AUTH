"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const roles = [1, 2, 3, 4, 5, 6, 7];
    const accesses = [1, 2, 3];
    const records = [];

    roles.forEach(role => {
      accesses.forEach(access => {
      records.push({
        user_role_id: role,
        access_id: access,
        created_at: new Date(),
        updated_at: new Date(),
      });
      });
    });

    await queryInterface.bulkInsert("user_role_access", records, {});
  },

  async down(queryInterface, Sequelize) {
    queryInterface.bulkDelete("user_role_access", null, {});
  },
};
