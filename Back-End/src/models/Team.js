import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  pairingToken: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9]{6}$/,
  },
  pairingTokenExpiresAt: { type: Date, required: true },
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
