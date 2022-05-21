module.exports = async (req, res, next) => {
  try {
    if (req.user.verificationStatus) {
      next();
    } else {
      throw {
        name: "EmailNotVerified",
        message: "Your email is not verified",
      };
    }
  } catch (err) {
    next(err);
  }
};
