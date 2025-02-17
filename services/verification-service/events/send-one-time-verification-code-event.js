const VerificationEvent = require("../../../models/verification/event/verification-event");

class SendOneTimeVerificationCodeEvent extends VerificationEvent {
    type = "aditya.event-management.verification.send-one-time-verification-code";
    constructor(payload) {
        super(payload);
    }
}

exports.SendOneTimeVerificationCodeEvent = SendOneTimeVerificationCodeEvent;