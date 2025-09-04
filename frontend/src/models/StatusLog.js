import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  service: String,    
  status: String,        
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.StatusLog ||
  mongoose.model("StatusLog", logSchema);
