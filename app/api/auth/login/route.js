// app/api/auth/login/route.js
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

    // IMPORTANT: In a real application, you would generate a JWT (JSON Web Token) here
    // and send it back to the client. The client would then store this token
    // (e.g., in an HttpOnly cookie) and send it with subsequent requests for authentication.
    // For this basic example, we'll just return success.
    return NextResponse.json({ message: 'Logged in successfully', userId: user._id }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}