const { BadRequest } = require("../../libs/error");
const { userStatus } = require("../../models/user/user-status");
const AuthService = require("./auth-service");

class ValidateTwoStepAuthService extends AuthService {
  constructor({ user_repository, validate_one_time_verification_code_service }) {
    super({ user_repository });
    this.validate_one_time_verification_code_service = validate_one_time_verification_code_service;
  }
  _execute = async ({ email, otp }) => {
    return await this.user_repository.handleManagedTransaction(async (transaction) => {
      if (!email) throw new BadRequest("Email Required");
      if (!otp) throw new BadRequest("OTP Required");

      await this.validate_one_time_verification_code_service.handle({ email, otp, purpose: "login", transaction })

      return this.gen_response_with_token(verification.user_details);
    });
  };
}

module.exports = ValidateTwoStepAuthService;
