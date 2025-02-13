"use strict";
const { Model } = require("sequelize");
const { outboxMessageStatus } = require("../outbox-message/outbox-message-status");

module.exports = (sequelize, DataTypes) => {
  class OutboxMessage extends Model {
    async markAsSent() {
      this.message_status = outboxMessageStatus.ENUM.SENT;
      this.sent_at = new Date();
      await this.save();
    }

    getMessageId() {
      return this.get().message_id;
    }

    getProperties() {
      const outbox_message = this.get();
      return {
        ...outbox_message.properties,
        headers: outbox_message.headers,
      };
    }

    getBody() {
      const outbox_message = this.get();
      return outbox_message.body;
    }
  }

  OutboxMessage.init(
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
      message_status: {
        type: DataTypes.ENUM(...outboxMessageStatus.getValues()),
        defaultValue: outboxMessageStatus.ENUM.PENDING,
        allowNull: false,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isDate: {
            msg: "Invalid sent_at value.",
          },
        },
      },
      headers: {
        type: DataTypes.JSON,
      },
      properties: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Properties is required.",
          },
        },
      },
      body: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Body is required.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "OutboxMessage",
      tableName: "outbox_messages",
    }
  );
  return OutboxMessage;
};
