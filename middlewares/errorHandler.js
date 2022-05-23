module.exports = (err, req, res, next) => {
  switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({
        errors: err.errors.map(({ path, message }) => ({
          type: path,
          message: message,
        })),
      });
      break;

    case "LoginValidationError":
    case "AlreadyInFriendlist":
    case "AddMessageFailed":
    case "validationError":
    case "FailedToDeleteConvertation":
    case "ChatRoomAlreadyCreate":
      res.status(400).json({
        // message: "Email/password is required",
        message: err.message,
      });
      break;

    case "UserNotValid":
      res.status(401).json({
        message: "Email/password is invalid",
      });
      break;

    /* FRIENDS API ERROR SPECIFIC */
    case "UserNotFound":
      res.status(404).json({
        message: err.message,
      });
      break;

    case "CannotDuplicateFriendRequest":
      res.status(400).json({
        message: err.message,
      });
      break;

    ////

    case "JsonWebTokenError":
      res.status(401).json({
        message: "Invalid token",
      });
      break;

    case "EmailVerificationError":
      res.status(400).json({
        message: err.message,
      });
      break;

    case "EmailNotVerified":
      res.status(403).json({
        message: err.message,
      });
      break;

    default:
      res.status(500).json({
        message: "Internal Server Error",
        err,
      });
      break;
  }
};
