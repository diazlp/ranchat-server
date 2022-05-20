"use strict";
const { Model } = require("sequelize");

const { generateHashPassword } = require("../helpers/bcrypt");
const { axiosRandomize } = require("../helpers/axios");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Friend, { foreignKey: "UserId" });
      User.hasOne(models.Profile, { foreignKey: "UserId" });
      User.hasOne(models.Payment, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Fullname is required",
          },
          isTwoWords(value) {
            if (value.trim().split(" ").length < 2) {
              throw new Error("Fullname should be at least two words");
            }
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email address should be unique",
        },
        validate: {
          notNull: {
            msg: "Email address is required",
          },
          isEmail: {
            msg: "Email address is invalid",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationCode: DataTypes.STRING,
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPremium: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate(async (instance, options) => {
    /* VERIFICATION GENERATOR WITH CIPRAND */
    const response = await axiosRandomize.get("/api", {
      params: {
        len: 5,
      },
    });

    instance.verificationCode = response.data?.Strings[0];

    instance.isVerified = false;
    instance.password = generateHashPassword(instance.password);

    if (!instance.profilePicture) {
      instance.profilePicture =
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80";
    }
  });
  return User;
};
