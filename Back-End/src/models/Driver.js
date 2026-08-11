import mongoose from 'mongoose';
import crypto from 'crypto';

const driverSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true, trim: true },
  sessionToken: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID(),
  },
}, { timestamps: true });

driverSchema.index({ teamId: 1 });


const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
