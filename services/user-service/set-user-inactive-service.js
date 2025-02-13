const { BadRequest } = require("../../libs/error");
const UserService = require("./user-service");

module.exports = class SetUserInactiveService extends UserService {
  _execute = async (req) => {
    const { user } = req.body;
    const { user_id } = user;
    const response = await this.user_repository.update({
      criteria: { uuid: user_id },
      payload: { status: "inactive" },
      options: { returning: true, plain: true },
    });
    if (!response[1]) throw new BadRequest("User not found");

    delete response[1].password;
    delete response[1].role_id;
    delete response[1].id;
    return response[1];
  };
};
