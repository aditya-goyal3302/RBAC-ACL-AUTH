const { asClass } = require("awilix");

module.exports = {
  base_repository: asClass(require("./base-repository.js")).scoped(),
  user_repository: asClass(require("./user-repository.js")).scoped(),
  acl_repository: asClass(require("./acl-repository.js")).scoped(),
  verification_logs_repository: asClass(require("./verification-repository.js")).scoped(),
  inbox_message_repository: asClass(require("./inbox-message-repository.js")).scoped(),
  outbox_message_repository: asClass(require("./outbox-message-repository.js")).scoped(),
};
