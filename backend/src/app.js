import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiReference } from "@scalar/express-api-reference";
import authRoutes from "./routes/auth.routes.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { openApiSpec } from "./config/openapi.js";

const app = express();

app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(logger);

// Serve OpenAPI Specification JSON
app.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

// Scalar API Reference Interactive UI at /docs
app.use(
  "/docs",
  apiReference({
    theme: "purple",
    spec: {
      content: openApiSpec,
    },
  })
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Marhba API is running 🚀",
    documentation: "/docs",
  });
});

app.use(errorHandler);

export default app;