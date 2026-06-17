// app/api/goals/route.js
import dbConnect from '../../../lib/dbConnect';
import Goal from '../../../lib/models/Goal';
import Book from '../../../lib/models/Book';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const goals = await Goal.find({ userId }).sort({ endDate: 1 }); // Sort by end date
    const books = await Book.find({ userId });

    const goalsWithProgress = [];

    for (const goal of goals) {
      let progress = 0;
      const startDate = new Date(goal.startDate);
      const endDate = new Date(goal.endDate);

      if (goal.type === 'books') {
        // Count completed books with completionDate in range [startDate, endDate]
        progress = books.filter(book => {
          if (book.status !== 'Completed' || !book.completionDate) return false;
          const compDate = new Date(book.completionDate);
          return compDate >= startDate && compDate <= endDate;
        }).length;
      } else if (goal.type === 'pages') {
        // Count pages read in timeframe [startDate, endDate]
        for (const book of books) {
          if (!book.readingHistory || book.readingHistory.length === 0) continue;
          
          // Sort reading history chronologically to compute transitions correctly
          const sortedHistory = [...book.readingHistory].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          let prevPage = 0;
          for (const entry of sortedHistory) {
            const increment = entry.page - prevPage;
            const entryTime = new Date(entry.timestamp);

            if (entryTime >= startDate && entryTime <= endDate) {
              progress += increment;
            }
            prevPage = entry.page;
          }
        }
      }

      // Update goal status
      goal.progress = progress;
      goal.isCompleted = progress >= goal.target;
      await goal.save();

      goalsWithProgress.push(goal.toObject({ virtuals: true }));
    }

    return NextResponse.json({ goals: goalsWithProgress }, { status: 200 });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, type, target, endDate } = await req.json();

    if (!userId || !type || !target || !endDate) {
      return NextResponse.json({ message: 'Missing required goal fields' }, { status: 400 });
    }

    const newGoal = await Goal.create({
      userId,
      type,
      target,
      endDate: new Date(endDate),
    });

    const goalWithProgress = newGoal.toObject({ virtuals: true });

    return NextResponse.json({ message: 'Goal added successfully', goal: goalWithProgress }, { status: 201 });
  } catch (error) {
    console.error('Error adding goal:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}