const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d", // Token expires in 1 day
      issuer: "aoxhub",
      audience: "MyClientApp",
    }
  );
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check issuer and audience
    if (decoded.iss !== "aoxhub" || decoded.aud !== "MyClientApp") {
      throw new Error("Invalid token claims");
    }

    return decoded;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
};

module.exports = { generateToken, verifyToken };
