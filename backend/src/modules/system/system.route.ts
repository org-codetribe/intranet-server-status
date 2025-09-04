import { Router } from "express";
import { systemController } from "./system.controller";
import { validate } from "../../middlewares/validate.middleware";
import { systemValidation } from "./system.validation";

const router = Router();

// POST /system/check → Run all checks
router.get("/check", systemController.checkAll);

// GET /system/logs → Get recent logs
router.get("/logs", systemController.getLogs);

export default router;
