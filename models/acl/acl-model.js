"use strict";
const { Model } = require("sequelize");
const { aclRoles } = require("./acl-roles");
const { aclMethods } = require("./acl-methods");

module.exports = (sequelize, DataTypes) => {
  class Acl extends Model {}
  Acl.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      end_point: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      method: {
        type: DataTypes.ENUM(...aclMethods.getValues()),
        allowNull: false,
      },
      title:{
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "Acl",
      tableName: "acls",
    }
  );
  return Acl;
};
