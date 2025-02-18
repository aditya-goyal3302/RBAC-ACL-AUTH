const SendVerificationCodeEvent = require("../../models/verification/event/send-verification-code-event");
const VerificationService = require("./verification-service");

module.exports = class SendOneTimeVerificationCodeService extends VerificationService {

  constructor({ verification_logs_repository, outbox_message_repository }) {
    super({ verification_logs_repository });
    this.outbox_message_repository = outbox_message_repository;
  }

  _execute = async ({ email, purpose, user, transaction }) => {
    
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("otp for email ", email,"is :", otp);

    await this.verification_logs_repository.create({
      payload: {
        email,
        otp,
        type: "OTP",
        purpose,
        expires_at: new Date(Date.now() + 1000 * 60 * 5),
        user_id: user.id,
      },
      options: { transaction },
    });

    const message = {
      email,
      otp,
      purpose,
      template: "OTP",
    };

    await this.outbox_message_repository.store_outbox_message({
      outbox_message: new SendVerificationCodeEvent(message),
      transaction,
    });

    return { message: "OTP sent successfully on registered email" };

  };
};
