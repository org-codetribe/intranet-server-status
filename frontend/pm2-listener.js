import pm2 from "pm2";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import StatusLog from "./models/StatusLog.js";

dotenv.config();

(async () => {
  await connectDB();

  pm2.connect((err) => {
    if (err) {
      console.error("PM2 connect error", err);
      process.exit(2);
    }

    pm2.launchBus(async (err, bus) => {
      if (err) throw err;

      bus.on("process:event", async (data) => {
        if (!data?.process?.name) return;

        if (["exit", "stop"].includes(data.event)) {
          await StatusLog.create({
            service: data.process.name,
            status: "down"
          });
          console.log(`❌ ${data.process.name} went down`);
        }

        if (data.event === "online") {
          await StatusLog.create({
            service: data.process.name,
            status: "up"
          });
          console.log(`✅ ${data.process.name} is back up`);
        }
      });
    });
  });
})();
