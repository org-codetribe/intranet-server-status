import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import systemRoutes from "./modules/system/system.route";
// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running 🚀" });
});

app.use("/api/system", systemRoutes);

export default app;
