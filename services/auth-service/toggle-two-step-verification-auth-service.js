const { BadRequest } = require("../../libs/error");
const { userStatus } = require("../../models/user/user-status");
const AuthService = require("./auth-service");

class ToggleTwoStepVerificationService extends AuthService {
  _execute = async ({ user, is_two_step_verification_enabled }) => {

    return await this.user_repository.handleManagedTransaction(async (transaction) => {

      let userData = await this.user_repository.findOne({
        criteria: { uuid: user.user_id },
        options: { transaction, plain: true },
      });

      if (!userData || userData.status !== userStatus.ENUM.ACTIVE) throw new BadRequest("Invalid email or password");

      userData = userData.toJSON();

      const updatedUser = await this.user_repository.update({
        criteria: { uuid: userData.uuid },
        options: { transaction, returning: true },
        payload: { is_two_step_verification_enabled: is_two_step_verification_enabled },
      });

      return updatedUser[1][0].is_two_step_verification_enabled;

    });
  };
}

module.exports = ToggleTwoStepVerificationService;
