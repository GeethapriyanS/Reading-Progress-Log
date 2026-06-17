import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../lib/models/User';
import Book from '../../../../lib/models/Book';
import Goal from '../../../../lib/models/Goal';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const books = await Book.find({ userId: id });
    const goals = await Goal.find({ userId: id });

    // Stats calculations
    const totalBooks = books.length;
    const readingBooks = books.filter(b => b.status === 'Reading').length;
    const completedBooks = books.filter(b => b.status === 'Completed').length;
    const totalPagesRead = books.reduce((sum, b) => sum + (b.currentPage || 0), 0);

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.isCompleted).length;

    const stats = {
      totalBooks,
      readingBooks,
      completedBooks,
      totalPagesRead,
      totalGoals,
      completedGoals
    };

    return NextResponse.json({ user, stats }, { status: 200 });
  } catch (error) {
    console.error('Fetch user profile error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { username, email, currentPassword, newPassword } = await req.json();

    // 1. Update Username if provided
    if (username) {
      user.username = username;
    }

    // 2. Update Email if provided
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
      }
      user.email = email;
    }

    // 3. Update Password if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Please provide current password to make security changes' }, { status: 400 });
      }

      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return NextResponse.json({ message: 'Incorrect current password' }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ message: 'New password must be at least 6 characters long' }, { status: 400 });
      }

      // Password hashing is performed pre-save in User model schema hook
      user.password = newPassword;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email
    };

    return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Update user profile error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
