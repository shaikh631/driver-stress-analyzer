import mongoose from 'mongoose';

const radioMessageSchema = new mongoose.Schema({
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  audioUrl: { type: String, required: true },
  transcript: { type: String, default: '' },
  mood: {
    type: String,
    enum: ['Calm', 'Stressed', 'Tired', 'Frustrated', 'unknown'],
    default: 'unknown',
  },
  confidence: { type: Number, default: 0, min: 0, max: 1 },
  reasoning: { type: String, default: '' },
}, { timestamps: true });

radioMessageSchema.index({ teamId: 1, createdAt: -1 });

const RadioMessage = mongoose.model('RadioMessage', radioMessageSchema);
export default RadioMessage;
