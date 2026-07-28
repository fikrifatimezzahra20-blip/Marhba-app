import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const authenticate = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      error: "Unauthorized",
    });

  }
};

export default authenticate;