// app/api/books/[id]/progress/route.js
import dbConnect from '../../../../../lib/dbConnect';
import Book from '../../../../../lib/models/Book';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params; // book ID

  try {
    const { currentPage } = await req.json();

    if (typeof currentPage === 'undefined' || currentPage < 0) {
      return NextResponse.json({ message: 'Invalid current page number' }, { status: 400 });
    }

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    if (currentPage > book.totalPages) {
      return NextResponse.json({ message: `Current page cannot exceed total pages (${book.totalPages})` }, { status: 400 });
    }

    book.currentPage = currentPage;
    book.readingHistory.push({ page: currentPage, timestamp: new Date() });

    // Update status if completed
    if (currentPage === book.totalPages && book.status !== 'Completed') {
      book.status = 'Completed';
      book.completionDate = new Date();
    } else if (currentPage > 0 && book.status === 'Yet to Start') {
      book.status = 'Reading';
    }

    await book.save();

    return NextResponse.json({ message: 'Reading progress updated', book }, { status: 200 });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}