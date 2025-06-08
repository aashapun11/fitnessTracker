const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // or min '1h', '7d', etc.
  });
};

module.exports = generateToken;
