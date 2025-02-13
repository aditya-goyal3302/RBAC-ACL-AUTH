const BaseRepository = require("./base-repository");
const { Acl } = require("../models");

class AclRepository extends BaseRepository {
  constructor() {
    super({ model: Acl });
  }
}

module.exports = AclRepository;
