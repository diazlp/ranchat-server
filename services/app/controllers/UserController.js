const { generateToken } = require("../helpers/jwt");
const { verifyPassword } = require("../helpers/bcrypt");
const { User, Profile } = require("../models");
const profile = require("../models/profile");

class UserController {
  static async register(req, res, next) {
    try {
      const userInputForm = {
        fullName: req.body?.fullName || null,
        email: req.body?.email || null,
        password: req.body?.password || null,
        city: req.body?.city || "Bandung, Jawa Barat",
      };

      const userCreatedData = await User.create(userInputForm);

      res.status(201).json({
        id: userCreatedData.id,
        fullName: userCreatedData.fullName,
        email: userCreatedData.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const userInputForm = {
        email: req.body?.email,
        password: req.body?.password,
      };
      if (!userInputForm.email) {
        throw { name: "LoginValidationError", message: "Email is required" };
      }

      if (!userInputForm.password) {
        throw { name: "LoginValidationError", message: "Password is required" };
      }

      const matchingUser = await User.findOne({
        where: {
          email: userInputForm.email,
        },
      });

      if (!matchingUser) {
        throw { name: "UserNotValid" };
      }

      const isPasswordMatch = verifyPassword(
        userInputForm.password,
        matchingUser.password
      );

      if (!isPasswordMatch) {
        throw { name: "UserNotValid" };
      }

      const token = generateToken({
        id: matchingUser.id,
        fullName: matchingUser.fullName,
        email: matchingUser.email,
      });

      res.status(200).json({
        access_token: token,
        profile: {
          id: matchingUser.id,
          fullName: matchingUser.fullName,
          email: matchingUser.email,
          city: matchingUser.city,
          profilePicture: matchingUser.profilePicture,
          isVerified: matchingUser.isVerified,
          status: matchingUser.status,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async verify(req, res, next) {
    try {
      const { verificationCode } = req.body;

      if (!verificationCode) {
        throw {
          name: "EmailVerificationError",
          message: "Please enter verification code",
        };
      }

      if (verificationCode.toLowerCase() === req.user.verificationCode) {
        await User.update(
          {
            isVerified: true,
          },
          {
            where: {
              email: req.user.email,
            },
          }
        );

        res.status(200).json({
          message: "Email successfully verified",
        });
      } else if (verificationCode.toLowerCase() !== req.user.verificationCode) {
        throw {
          name: "EmailVerificationError",
          message: "Verification code is not valid",
        };
      }
    } catch (err) {
      next(err);
    }
  }

  static async addProfile(req, res, next) {
    try {
      const { id } = req.user;
      const {
        profilePicture,
        birthday,
        address,
        gender,
        bio,
        banner,
        facebook,
        instagram,
        twitter,
      } = req.body;

      const userProfile = await Profile.findOne({
        where: { UserId: id },
      });
      if (userProfile) {
        await Profile.update(
          {
            profilePicture,
            birthday,
            address,
            gender,
            bio,
            banner,
            facebook,
            instagram,
            twitter,
            UserId: id,
          },
          {
            where: { UserId: id },
          }
        );
        res.status(201).json({
          profilePicture,
          birthday,
          address,
          gender,
          bio,
          banner,
          facebook,
          instagram,
          twitter,
        });
      } else {
        const profile = await Profile.create({
          profilePicture,
          birthday,
          address,
          gender,
          bio,
          banner,
          facebook,
          instagram,
          twitter,
          UserId: id,
        });
        res.status(201).json(profile);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async findProfile(req, res, next) {
    try {
      const { id } = req.user;
      const findProfile = await Profile.findOne({
        where: {
          UserId: id,
        },
      });

      res.status(200).json(findProfile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
