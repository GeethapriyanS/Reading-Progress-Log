// app/api/books/route.js
import dbConnect from "../../../lib/dbConnect"
import Book from '../../../lib/models/Book';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();

  try {
    // In a real application, you'd get the userId from an authenticated session/token
    // For now, assume userId is passed in the request body for testing purposes
    const { userId, title, author, totalPages, genre, startDate, description, tags, coverImage } = await req.json();

    if (!userId || !title || !author || !totalPages) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newBook = await Book.create({
      userId,
      title,
      author,
      totalPages,
      genre,
      startDate,
      description,
      tags,
      coverImage,
    });

    return NextResponse.json({ message: 'Book added successfully', book: newBook }, { status: 201 });
  } catch (error) {
    console.error('Add book error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // Get userId from query param

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const books = await Book.find({ userId }).sort({ startDate: -1 });
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error('Fetch books error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}