"use strict";
const { Model } = require("sequelize");
const { inboxMessageStatus } = require("./inbox-message-status");

module.exports = (sequelize, DataTypes) => {
  class InboxMessage extends Model {}

  InboxMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message_id: {
        type: DataTypes.UUID,
        unique: "unique_index",
        allowNull: false,
      },
      handler_name: {
        type: DataTypes.STRING,
        unique: "unique_index",
        allowNull: false,
      },
      message_status: {
        type: DataTypes.ENUM(...inboxMessageStatus.getValues()),
        defaultValue: inboxMessageStatus.ENUM.RECEIVED,
      },
    },
    {
      sequelize,
      modelName: "InboxMessage",
      tableName: "inbox_messages",
      createdAt: "handled_at",
      updatedAt: false,
      indexes: [
        {
          name: "unique_index",
          unique: true,
          fields: ["message_id", "handler_name"],
        },
      ],
    }
  );
  return InboxMessage;
};
