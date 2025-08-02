import dbConnect from '../../../../lib/dbConnect';
import Goal from '../../../../lib/models/Goal';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await req.json();
    const { type, target, progress, endDate, isCompleted } = body;

    const updateFields = {};
    if (type) updateFields.type = type;
    if (target !== undefined) updateFields.target = target;
    if (progress !== undefined) updateFields.progress = progress;
    if (endDate) updateFields.endDate = new Date(endDate);
    if (isCompleted !== undefined) updateFields.isCompleted = isCompleted;

    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }

    const goalWithProgress = updatedGoal.toObject({ virtuals: true });

    return NextResponse.json({ message: 'Goal updated successfully', goal: goalWithProgress }, { status: 200 });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedGoal = await Goal.findByIdAndDelete(id);

    if (!deletedGoal) {
      return NextResponse.json({ message: 'Goal not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Goal deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}