const { InternalServerError } = require("../../libs/error");
const SendVerificationTokenEvent = require("../../models/verification/event/send-verification-token-event");
const VerificationService = require("./verification-service");

module.exports = class SendResetPasswordTokenService extends VerificationService {

  constructor({ verification_logs_repository, outbox_message_repository }) {
    super({ verification_logs_repository });
    this.outbox_message_repository = outbox_message_repository;
  }
  
  _execute = async ({ purpose = "reset_password", user, transaction }) => {
    
    const verificationLog = await this.verification_logs_repository.create({
      payload: {
        user_id: user.id,
        email: user.email,
        purpose,
        expires_at: new Date(Date.now() + 1000 * 60 * 60 * 2),
        type: "TOKEN",
      },
      options: { transaction },
    });
    
    if (!verificationLog) throw new InternalServerError("Error in sending Reset Password Link");

    const token = verificationLog.uuid;
    const client = process.env.CLIENT_URL;

    const mailData = {
      to: user.email,
      subject: "Reset Password Link",
      url: `${client}/reset_password/${token}`,
      name: user.name,
    };  
    
    await this.outbox_message_repository.store_outbox_message({
      outbox_message: new SendVerificationTokenEvent(mailData),
      options: { transaction },
    })

    return { message: "Token sent successfully on registered email" }

  };
};
