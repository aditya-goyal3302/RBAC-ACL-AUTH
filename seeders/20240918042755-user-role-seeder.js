"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.bulkInsert("user_roles", [
      {
        id: 1,
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        title: "EVENT_ORGANIZER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        uuid: "550e8400-e29b-41d4-a716-446655440001",
        title: "EVENT_MANAGER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        uuid: "550e8400-e29b-41d4-a716-446655440002",
        title: "VENUE_OWNER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        uuid: "550e8400-e29b-41d4-a716-446655440003",
        title: "VENUE_MANAGER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        uuid: "550e8400-e29b-41d4-a716-446655440004",
        title: "CUSTOMER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 6,
        uuid: "550e8400-e29b-41d4-a716-446655440005",
        title: "CUSTOMER_SERVICE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        uuid: "550e8400-e29b-41d4-a716-446655440006",
        title: "APPROVER",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    queryInterface.truncate("user_roles");
  },
};
