const Event = require("../../common/event");

class VerificationEvent extends Event {
  getBody() {
    return {
      verification: this.payload,
    };
  }
}

module.exports = VerificationEvent;
