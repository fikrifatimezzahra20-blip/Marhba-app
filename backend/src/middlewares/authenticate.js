import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret";

    const decoded = jwt.verify(token, secret);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(401).json({
      error: "Unauthorized",
    });
  }
};

export default authenticate;