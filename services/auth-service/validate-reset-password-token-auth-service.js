const { BadRequest } = require("../../libs/error");
const AuthService = require("./auth-service");

class ValidateResetPasswordTokenService extends AuthService {
  constructor({ validate_reset_password_token_service, user_repository }) {
    super({ user_repository });
    this.validate_reset_password_token_service = validate_reset_password_token_service;
  }

  _execute = async ({ token }) => {

    return await this.user_repository.handleManagedTransaction(async (transaction) => {
      if (!token) throw new BadRequest("Token Required");

      await this.validate_reset_password_token_service.handle({ token, transaction });

      return { message: "Token Verified Successfully" };

    });
  };
}

module.exports = ValidateResetPasswordTokenService;
