import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  pairingToken: { type: String, unique: true, sparse: true, default: null },
  pairingTokenExpiresAt: { type: Date, default: null },
}, { timestamps: true });



const Team = mongoose.model('Team', teamSchema);
export default Team;
