"use strict";

const { inboxMessageStatus } = require("../models/inbox-message/inbox-message-status");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "inbox_messages",
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message_id: {
          type: Sequelize.UUID,
          unique: "unique_index",
          allowNull: false,
        },
        handler_name: {
          type: Sequelize.STRING,
          unique: "unique_index",
          allowNull: false,
        },
        message_status: {
          type: Sequelize.ENUM(...inboxMessageStatus.getValues()),
          defaultValue: inboxMessageStatus.ENUM.RECEIVED,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "handled_at",
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      {
        uniqueKeys: {
          unique_index: {
            fields: ["message_id", "handler_name"],
          },
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("inbox_messages");
  },
};
