const db = require("../models");
const BaseRepository = require("./base-repository");
const { outboxMessageStatus } = require("../models/outbox-message/outbox-message-status");

class OutboxMessageRepository extends BaseRepository {
  constructor() {
    super({ model: db["OutboxMessage"] });
  }
  async store_outbox_message({ outbox_message, transaction }) {
    const payload = {
      message_id: outbox_message.getId(),
      type: outbox_message.getType(),
      properties: outbox_message.getProperties(),
      headers: outbox_message.getHeaders(),
      body: outbox_message.getPayload(),
    };

    return this.create({ payload, options: { transaction } });
  }

  async getUnsentMessages(limit) {
    let criteria = {
      message_status: outboxMessageStatus.ENUM.PENDING,
    };

    let order = [["id", "ASC"]];

    return this.findAll({ criteria, order, limit });
  }
}
module.exports = OutboxMessageRepository;
