const { UserRole } = require("../models");
const BaseRepository = require("./base-repository");

class UserRoleRepository extends BaseRepository {
  constructor() {
    super({ model: UserRole });
  }
}

module.exports = UserRoleRepository;
