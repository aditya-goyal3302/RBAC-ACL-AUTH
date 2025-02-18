const { BadRequest } = require("../../libs/error");
const VerificationService = require("./verification-service");
const { User } = require("../../models");
const { userStatus } = require("../../models/user/user-status");
const { Op } = require("sequelize");

module.exports = class ValidateResetPasswordTokenService extends VerificationService {
  _execute = async ({ purpose = "reset_password", token, transaction }) => {

    let verificationLog = await this.verification_logs_repository.findOne({
      criteria: { uuid: token, type: "TOKEN", purpose, used_at: null, expires_at: { [Op.gt]: new Date() } },
      options: { transaction, plain: true },
      attributes: ["uuid", "expires_at", "email"],
      include: [{
        model: User,
        as: "user_details",
        attributes: ["email", "name", "status", "uuid"],
      }],
    });

    if (!verificationLog || verificationLog.expires_at < new Date()) throw new BadRequest("Invalid or expired token!");

    const user = verificationLog.user_details;

    if (!user || user.status !== userStatus.ENUM.ACTIVE) throw new BadRequest("User not found!");
    if (user.email !== verificationLog.email) throw new BadRequest("Email Mismatch!");

    return { message: 'Token Valid!', user_details: user };
  };
};
