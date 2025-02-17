import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  deviceInfo: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 14 * 24 * 60 * 60 
  }
});

sessionSchema.index({ userId: 1, createdAt: 1 });

export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
