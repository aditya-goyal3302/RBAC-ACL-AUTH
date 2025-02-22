class UserRouter {
  constructor({
    express,
    get_user_details_controller,
    patch_user_details_controller,
    set_user_image_controller,
    remove_user_image_controller,
    auth_middleware,
    // set_user_active_controller,
    // set_user_inactive_controller
  }) {
    this.router = express.Router();

    this.get_user_details_controller = get_user_details_controller;
    this.patch_user_details_controller = patch_user_details_controller;
    this.set_user_image_controller = set_user_image_controller;
    this.remove_user_image_controller = remove_user_image_controller;
    // this.set_user_active_controller = set_user_active_controller;
    // this.set_user_inactive_controller = set_user_inactive_controller;

    this.auth_middleware = auth_middleware;

    this.setup_routes();
  }

  setup_routes = () => {
    this.router
      .use((req, res, next) => this.auth_middleware.handle(req, res, next)) // to check if user is authenticated
      .get("/", (req, res, next) => this.get_user_details.handle_request(req, res, next)) // to get user details by user himself
      .patch("/", (req, res, next) => this.patch_user_details.handle_request(req, res, next)) // to set details of users
      .patch("/image", (req, res, next) => this.set_user_image.handle_request(req, res, next))
      .delete("/image", (req, res, next) => this.remove_user_image.handle_request(req, res, next));
    // .patch("/active", (req, res, next) => this.set_user_active.handle_request(req, res, next))
    // .patch("/inactive", (req, res, next) => this.set_user_inactive.handle_request(req, res, next));
  };
}

module.exports = UserRouter;
