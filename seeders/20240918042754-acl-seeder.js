"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert("acls", [
      {
        id: 1,
        uuid: "123e4567-e89b-12d3-a456-426614174002",
        end_point: "/user/profile",
        method: "GET",
        title: "Get User Profile",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: "123e4567-e89b-12d3-a456-426614174003",
        end_point: "/user/profile",
        method: "PUT",
        title: "Update User Profile",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: "123e4567-e89b-12d3-a456-426614174004",
        end_point: "/user/delete",
        method: "DELETE",
        title: "Delete User",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.truncate("acls");
  },
};
