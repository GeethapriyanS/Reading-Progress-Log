import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../lib/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Please enter all fields' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Logged in successfully', userId: user._id }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}