const { BadRequest } = require("../../libs/error");
const VerificationService = require("./verification-service");
const { userStatus } = require("../../models/user/user-status");
const { User } = require("../../models");

module.exports = class ValidateOneTimeVerificationCodeService extends VerificationService {
  
  _execute = async ({ email, otp, purpose, transaction }) => {
    
    const verification = await this.verification_logs_repository.findOne({
      criteria: { email, otp, type: "OTP", purpose, used_at: null, expires_at: { [Op.gt]: new Date() } },
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

    if (!verification || verification.expires_at < new Date())
      throw new BadRequest("Invalid or expired OTP");

    if (verification.user_details || verification.user_details.status !== userStatus.ENUM.ACTIVE) 
      throw new BadRequest("User Not Found");

    // if () 
    //   throw new BadRequest("OTP ");

    await this.verification_logs_repository.update({
      payload: { used_at: new Date() },
      criteria: { id: verification.id },
      options: { transaction },
    });

    return verification;

  };
};
