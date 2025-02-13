const { BadRequest } = require("../../libs/error");
const UserService = require("./user-service");

module.exports = class GetUserDetailsService extends UserService {
  _execute = async (req) => {
    const { user_id } = req.body.user;
    const response = await this.user_repository.findUser({ criteria: { uuid: user_id } });
    if (!response) throw new BadRequest("User not found");
    delete response.password;
    delete response.role_id;
    delete response.id;
    response.role_data = { ...response.role_data.toJSON(), access: undefined, id: undefined };
    return response;
  };
};
