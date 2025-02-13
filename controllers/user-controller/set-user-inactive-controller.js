const { SUCCESS } = require("../../libs/constants");
const UserController = require("./user-controller");

class SetUserInactiveController extends UserController {
  constructor({ set_user_inactive_service }) {
    super();
    this.service = set_user_inactive_service;
  }
  _execute = async (req) => {
    const response = await this.service.handle(req);
    return [response, SUCCESS];
  };
}

module.exports = SetUserInactiveController;
