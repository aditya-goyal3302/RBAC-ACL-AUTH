const { BadRequest } = require("../../libs/error");
const { userStatus } = require("../../models/user/user-status");
const AuthService = require("./auth-service");

class ToggleTwoStepVerificationService extends AuthService {
  _execute = async ({ user }) => {
    return await this.user_repository.handleManagedTransaction(async (transaction) => {
      let userData = await this.user_repository.findOne({
        criteria: { uuid: user.user_id },
        options: { transaction, plain: true },
      });

      if (!user || user.status !== userStatus.ENUM.ACTIVE) throw new BadRequest("Invalid email or password");

      userData = userData.toJSON();

      const updatedUser = await this.user_repository.update({
        criteria: { uuid: userData.uuid },
        options: { transaction },
        payload: { is_two_step_verification_enabled: true },
      });

      return updatedUser;
    });
  };
}

module.exports = ToggleTwoStepVerificationService;
