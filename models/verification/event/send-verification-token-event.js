const VerificationEvent = require("./verification-event");
const { SendVerificationTokenEventType } = require("./verification-event-types");

class SendVerificationTokenEvent extends VerificationEvent {
  type = SendVerificationTokenEventType;
}

module.exports = SendVerificationTokenEvent;
