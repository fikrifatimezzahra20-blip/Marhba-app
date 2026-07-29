import sequelize from "../config/database.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";

User.hasMany(RefreshToken, { foreignKey: "userId", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, RefreshToken };