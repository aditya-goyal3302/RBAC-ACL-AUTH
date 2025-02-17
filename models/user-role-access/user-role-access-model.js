"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRoleAccess extends Model {
    static associate(models) {

      this.belongsTo(models.UserRole, {
        foreignKey: "user_role_id",
        as: "user_role",
      });

      this.belongsTo(models.Acl, {
        foreignKey: "access_id",
        as: "access",
      });

      models.UserRole.hasMany(this, {
        foreignKey: "user_role_id",
        as: "user_role_access",
      });

      models.Acl.hasMany(this, {
        foreignKey: "access_id",
        as: "access_for_user_roles",
      });

      models.UserRole.belongsToMany(models.Acl, {
        through: {
          model: this,
          attribute: []
        },
        foreignKey: "user_role_id",
        otherKey: "access_id",
        as: "user_access",

      });

      models.Acl.belongsToMany(models.UserRole, {
        through: {
          model: this,
          attribute: []
        },
        foreignKey: "access_id",
        otherKey: "user_role_id",
        as: "accesses_for_user_roles",
      });

    }
  }

  UserRoleAccess.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user_roles",
          key: "id",
        }
      },
      access_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "acls",
          key: "id",
        }
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UserRoleAccess",
      tableName: "user_role_access",
    }
  );
  return UserRoleAccess;
};
