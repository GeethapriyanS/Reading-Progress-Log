// lib/models/Goal.js
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['pages', 'books'],
    required: true,
  },
  target: {
    type: Number,
    required: true,
    min: 1,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

// Virtual for progress percentage
GoalSchema.virtual('progressPercentage').get(function () {
  if (this.target === 0) return 0;
  return (this.progress / this.target) * 100;
});

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);