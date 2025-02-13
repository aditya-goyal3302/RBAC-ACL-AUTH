const { SUCCESS } = require("../../libs/constants");
const UserController = require("./user-controller");

class SetUserActiveController extends UserController {
  constructor({ set_user_active_service }) {
    super();
    this.service = set_user_active_service;
  }
  _execute = async (req) => {
    const response = await this.service.handle(req);
    return [response, SUCCESS];
  };
}

module.exports = SetUserActiveController;
