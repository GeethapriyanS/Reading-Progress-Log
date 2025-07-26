// lib/models/Book.js
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  totalPages: {
    type: Number,
    required: true,
    min: 1,
  },
  currentPage: {
    type: Number,
    default: 0,
    min: 0,
  },
  genre: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Yet to Start', 'Reading', 'Completed'],
    default: 'Yet to Start',
  },
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  coverImage: String,
  readingHistory: [
    {
      page: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  notes: [
    {
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  quotes: [
    {
      content: String,
      page: Number,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    trim: true,
  },
});

// Virtual for progress percentage
BookSchema.virtual('progress').get(function () {
  if (this.totalPages === 0) return 0;
  return (this.currentPage / this.totalPages) * 100;
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);