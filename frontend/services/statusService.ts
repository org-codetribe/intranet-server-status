import api from "./api";

export const statusService = {
  checkStatus: () => api.get("/api/system/check").then((res) => res.data),
  getLogs: () => api.get("/api/system/logs").then((res) => res.data),
};
