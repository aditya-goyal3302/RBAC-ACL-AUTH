const { InternalServerError } = require("../../libs/error");

class BaseController {
  async handle_request(req, res, next) {
    try {
      const [response, status] = await this._execute(req);
      res.status(status).send(response);
    } catch (error) {
      console.log("error: ", error);
      return next(error);
    }
  }

  async _execute(req) {
    throw new InternalServerError("Method not implemented.");
  }
}

module.exports = BaseController;
