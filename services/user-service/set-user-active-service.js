const { BadRequest } = require("../../libs/error");
const UserService = require("./user-service");

module.exports = class SetUserActiveService extends UserService {
  _execute = async (req) => {
    const {
      user: { user_id },
    } = req.body;
    const response = await this.user_repository.update({
      criteria: { uuid: user_id },
      payload: { status: "active" },
      options: { returning: true, plain: true },
    });
    if (!response[1]) throw new BadRequest("User not found");

    response.password = undefined;
    delete response[1].role_id;
    delete response[1].id;
    return response[1];
  };
};
