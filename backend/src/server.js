import app from "./app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Tables synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server error:", error.message);
  }
}

startServer();