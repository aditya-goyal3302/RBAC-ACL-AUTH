const { BadRequest } = require("../../libs/error");
const VerificationService = require("./verification-service");
const { User } = require("../../models");

module.exports = class ValidateResetPasswordTokenService extends VerificationService {
  _execute = async ({ token, transaction }) => {
    
    let verificationLog = await this.verification_logs_repository.findOne({
      criteria: { uuid: token },
      options: {
        transaction,
        plain: true
      },
      attributes: ["uuid", "expires_at"],
      include: [{
        model: User,
        as: "user_details",
        attributes: ["email", "name"]
      }],
    });

    if (!verificationLog) throw new BadRequest("Token Invalid!");
    if (verificationLog.expires_at < new Date()) throw new BadRequest("Token Expired!");

    return verificationLog;
  };
};
