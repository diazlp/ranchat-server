const bcrypt = require("bcryptjs");

const generateHashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  generateHashPassword,
  verifyPassword,
};
