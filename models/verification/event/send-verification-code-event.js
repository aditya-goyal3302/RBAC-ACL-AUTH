const VerificationEvent = require("./verification-event");
const { SendVerificationCodeEventType } = require("./verification-event-types");

class SendVerificationCodeEvent extends VerificationEvent {
  type = SendVerificationCodeEventType;
}

module.exports = SendVerificationCodeEvent;
