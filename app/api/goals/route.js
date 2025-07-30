// app/api/goals/route.js
import dbConnect from '../../../lib/dbConnect';
import Goal from '../../../lib/models/Goal';
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
    const goalsWithProgress = goals.map(goal => goal.toObject({ virtuals: true }));

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