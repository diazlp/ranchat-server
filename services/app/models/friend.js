"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Friend.belongsTo(models.User, { as: "userData", foreignKey: "UserId" });
      Friend.belongsTo(models.User, {
        as: "FriendData",
        foreignKey: "FriendId",
      });
    }
  }
  Friend.init(
    {
      UserId: DataTypes.INTEGER,
      FriendId: { type: DataTypes.INTEGER },
      friendStatus: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Friend",
    }
  );
  return Friend;
};
