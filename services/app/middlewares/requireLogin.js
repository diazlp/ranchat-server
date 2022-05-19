// Authentication middleware

const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "JsonWebTokenError" };
    }

    const { email } = verifyToken(access_token);

    const userAuthenticated = await User.findOne({
      where: {
        email,
      },
    });

    if (!userAuthenticated) {
      throw { name: "JsonWebTokenError" };
    }

    req.user = {
      id: userAuthenticated.id,
      fullName: userAuthenticated.fullName,
      email: userAuthenticated.email,
      city: userAuthenticated.city,
      imageUrl: userAuthenticated.profilePicture,
      verificationStatus: userAuthenticated.isVerified,
      verificationCode: userAuthenticated.verificationCode.toLowerCase(),
      status: userAuthenticated.status,
    };

    next();
  } catch (err) {
    next(err);
  }
};
