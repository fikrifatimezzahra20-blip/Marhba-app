import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret";
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "15m";

  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn }
  );
};

export const generateRefreshToken = (user) => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "default_refresh_secret";
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  return jwt.sign(
    { id: user.id },
    secret,
    { expiresIn }
  );
};

export default generateAccessToken;