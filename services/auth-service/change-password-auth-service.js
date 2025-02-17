const { BadRequest } = require("../../libs/error");
const { userStatus } = require("../../models/user/user-status");
const AuthService = require("./auth-service");

class ChangePasswordService extends AuthService {
  _execute = async ({ user, old_password, new_password }) => {
    const resp = await this.user_repository.handleManagedTransaction(async (transaction) => {
      if (!old_password) throw new BadRequest("Old Password Required");
      if (!new_password) throw new BadRequest("New Password Required");

      let userData = await this.user_repository.findOne({
        criteria: { uuid: user.user_id },
        options: { transaction, plain: true },
      });

      const check = await userData.comparePassword(old_password);
      if (!check) throw new BadRequest("Invalid Old Password");

      if (!userData || userData.status !== userStatus.ENUM.ACTIVE) throw new BadRequest("User Blocked");

      const updatedUser = await this.user_repository.findOne({
        criteria: { uuid: userData.uuid },
        options: { transaction },
      });

      updatedUser.password = new_password;
      await updatedUser.save({ transaction });

      return userData;
    });
    return await this.gen_response_with_token(resp);
  };
}

module.exports = ChangePasswordService;
