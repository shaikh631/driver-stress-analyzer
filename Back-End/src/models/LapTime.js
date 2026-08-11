import mongoose from 'mongoose';

const lapTimeSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  lapNumber: { type: Number, required: true },
  lapTimeMs: { type: Number, required: true },
  timestamp: { type: Date, default: () => new Date() },
}, { timestamps: true });

lapTimeSchema.index({ teamId: 1, timestamp: 1 });
lapTimeSchema.index({ driverId: 1, lapNumber: 1 });

const LapTime = mongoose.model('LapTime', lapTimeSchema);
export default LapTime;
