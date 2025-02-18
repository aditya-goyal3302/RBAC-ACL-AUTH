const { InternalServerError } = require("../../libs/error");

class BaseService {
  handle = async (payload, params) => this._execute(payload, params);

  _execute = async (payload, params) => {
    throw new InternalServerError("Method not implemented");
  };
}

module.exports = BaseService;
