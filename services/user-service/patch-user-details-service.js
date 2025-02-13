const { BadRequest } = require("../../libs/error");
const UserService = require("./user-service");

module.exports = class PatchUserDetailsService extends UserService {
  _execute = async ({ user: { user_id }, name, phone_no, email, pincode, address, city, country, state, fax }) => {
    const response = await this.user_repository.update({
      criteria: { uuid: user_id },
      payload: { name, phone_no, email, pincode, address, city, country, state, fax },
      options: { returning: true, plain: true },
    });
    if (!response[1]) throw new BadRequest("User not found");
    const user = response[1];
    delete user.password;
    delete user.role_id;
    delete user.id;
    return user;
  };
};
