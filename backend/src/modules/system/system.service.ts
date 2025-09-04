import axios from "axios";
import mongoose from "mongoose";
import { ISystemStatus, SystemStatus } from "./system.model";

export const systemService = {
  async checkBackend(apiUrl: string) {
    let result: Partial<ISystemStatus>;
    try {
      const response = await axios.get(apiUrl, { timeout: 5000 });
      result = {
        service: "Backend",
        status: response.status === 200 ? "UP" : "DOWN",
        checkedAt: new Date(),
        targetUrl: apiUrl,
      };
    } catch (err: any) {
      result = {
        service: "Backend",
        status: "DOWN",
        message: err.message,
        checkedAt: new Date(),
        targetUrl: apiUrl,
      };
    }
    await new SystemStatus(result).save();
    return result?.status;
  },

  async checkMongo(mongoUri: string) {
    let result: Partial<ISystemStatus>;
    try {
      const connection = await mongoose.createConnection(mongoUri).asPromise();
      await connection.close();
      result = {
        service: "MongoDB",
        status: "UP",
        checkedAt: new Date(),
        targetUrl: mongoUri,
      };
    } catch (err: any) {
      result = {
        service: "MongoDB",
        status: "DOWN",
        message: err.message,
        checkedAt: new Date(),
        targetUrl: mongoUri,
      };
    }
    await new SystemStatus(result).save();
    return result?.status;
  },

  async checkFrontend(url: string) {
    let result: Partial<ISystemStatus>;
    try {
      const response = await axios.get(url, { timeout: 5000 });
      result = {
        service: "Frontend",
        status: response.status === 200 ? "UP" : "DOWN",
        checkedAt: new Date(),
        targetUrl: url,
      };
    } catch (err: any) {
      result = {
        service: "Frontend",
        status: "DOWN",
        message: err.message,
        checkedAt: new Date(),
        targetUrl: url,
      };
    }
    await new SystemStatus(result).save();
    return result?.status;
  },

  async getLogs(limit = 20) {
    return await SystemStatus.find().sort({ createdAt: -1 }).limit(limit);
  },
};
