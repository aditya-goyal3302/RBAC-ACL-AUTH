const ENUM = require("../common/enum");

class InboxMessageStatus extends ENUM {
  static ENUM = {
    RECEIVED: "RECEIVED",
    READ: "READ",
    _executeD: "_executeD",
    FAILED: "FAILED",
  };
}

exports.inboxMessageStatus = InboxMessageStatus;
