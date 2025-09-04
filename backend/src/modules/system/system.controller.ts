import { Request, Response } from "express";
import { systemService } from "./system.service";
import { systemValidation } from "./system.validation";
import dotenv from "dotenv";
dotenv.config();
export const systemController = {
  async checkAll(req: Request, res: Response) {
    try {
      const backendUrl = process.env.INTERANET_BACKEND_URL || "";
      const mongoUri = process.env.INTRANET_MONGO_URL || "";
      const frontendUrl = process.env.INTRANET_FRONTEND_URL || "";
      console.log("backendUrl", backendUrl);

      const [backend, mongo, frontend] = await Promise.all([
        systemService.checkBackend(backendUrl),
        systemService.checkMongo(mongoUri),
        systemService.checkFrontend(frontendUrl),
      ]);

      return res.json({ backend, mongo, frontend });
    } catch (err: any) {
      console.log(err);

      return res.status(500).json({ error: err.message });
    }
  },

  async getLogs(req: Request, res: Response) {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 20;
      const logs = await systemService.getLogs(limit);
      return res.json(logs);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  },
};
