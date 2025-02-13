const ENUM = require("../common/enum");

class AclMethods extends ENUM {
  static ENUM = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
  };
}

exports.aclMethods = AclMethods;
