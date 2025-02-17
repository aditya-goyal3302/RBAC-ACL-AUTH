const AuthController = require("./auth-controller");

class ToggleTwoStepVerificationController extends AuthController {
    constructor({ toggle_two_step_verification_service }) {
        super();
        this.toggle_two_step_verification_service = toggle_two_step_verification_service;
    }

    async _execute(req) {
        const response = await this.toggle_two_step_verification_service.handle(req.body);
        return [{ message: `Two step verification turned ${response? "on" : "off"} successfully` }, 200];
    }
}

module.exports = ToggleTwoStepVerificationController;