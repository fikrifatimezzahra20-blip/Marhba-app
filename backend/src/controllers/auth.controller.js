import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, RefreshToken } from "../models/index.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

const REFRESH_TOKEN_DAYS = 7;

// Helper to save refresh token in database
const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  await RefreshToken.create({
    token,
    userId,
    expiresAt,
    revoked: false,
  });
};

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(user.id, refreshToken);

    res.status(201).json({
      accessToken,
      refreshToken,
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
  try {
    const { email, password } = req.body;

    // Search user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Email ou mot de passe incorrect",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(user.id, refreshToken);

    res.json({
      accessToken,
      refreshToken,
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

// Refresh Token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Refresh token required",
      });
    }

    // Find token in DB
    const storedToken = await RefreshToken.findOne({
      where: { token, revoked: false },
    });

    if (!storedToken) {
      return res.status(401).json({
        error: "Invalid refresh token",
      });
    }

    if (new Date() > new Date(storedToken.expiresAt)) {
      await storedToken.update({ revoked: true });
      return res.status(401).json({
        error: "Refresh token expired",
      });
    }

    // Verify token secret
    const refreshSecret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "default_refresh_secret";
    let decoded;
    try {
      decoded = jwt.verify(token, refreshSecret);
    } catch (err) {
      await storedToken.update({ revoked: true });
      return res.status(401).json({
        error: "Invalid or corrupted refresh token",
      });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    // Issue new access token and new rotated refresh token
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Revoke current token and save new one (Token Rotation)
    await storedToken.update({ revoked: true });
    await saveRefreshToken(user.id, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (token) {
      await RefreshToken.update(
        { revoked: true },
        { where: { token } }
      );
    }

    res.json({
      message: "Logged out successfully",
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Me
export const me = async (req, res) => {
  res.json({
    id: req.user.id,
    fullName: req.user.fullName,
    email: req.user.email,
  });
};