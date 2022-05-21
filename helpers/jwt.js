const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY;

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET);
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
