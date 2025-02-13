const ENUM = require("../common/enum");

class OutboxMessageStatus extends ENUM {
  static ENUM = {
    PENDING: "PENDING",
    SENT: "SENT",
    FAILED: "FAILED",
  };
}

exports.outboxMessageStatus = OutboxMessageStatus;
