const BaseRepository = require("./base-repository");
const db = require("../models");

class InboxMessageRepository extends BaseRepository {
  constructor() {
    super({ model: db["InboxMessage"] });
  }

  async storeInboxMessage(outbox_message, transaction) {
    return this.create(outbox_message, { transaction });
  }

  async getInboxMessageExist(message_id, handler_name) {
    let criteria = { message_id, handler_name };

    return this.findOne(criteria);
  }
}
module.exports = InboxMessageRepository;
