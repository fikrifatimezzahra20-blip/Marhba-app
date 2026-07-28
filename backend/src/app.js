import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(logger);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Marhba API is running 🚀",
  });
});

app.use(errorHandler);

export default app;