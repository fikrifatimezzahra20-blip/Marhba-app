import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

// Register
export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  res.json({
    message: "Login coming soon"
  });
};

// Me
export const me = async (req, res) => {
  res.json({
    message: "Profile coming soon"
  });
};