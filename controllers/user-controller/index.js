const { asClass } = require("awilix");

module.exports = {
  get_user_details_controller: asClass(require("./get-user-details-controller")).scoped(),
  patch_user_details_controller: asClass(require("./patch-user-details-controller")).scoped(),
  set_user_image_controller: asClass(require("./set-user-image-controller")).scoped(),
  remove_user_image_controller: asClass(require("./remove-user-image-controller")).scoped(),
  set_user_active_controller: asClass(require("./set-user-active-controller")).scoped(),
  set_user_inactive_controller: asClass(require("./set-user-inactive-controller")).scoped(),
};
