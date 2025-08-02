import dbConnect from '../../../../lib/dbConnect';
import Book from '../../../../lib/models/Book';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const bookWithProgress = book.toObject({ virtuals: true });

    return NextResponse.json({ book: bookWithProgress }, { status: 200 });
  } catch (error) {
    console.error('Error fetching single book:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await req.json();
    const { title, author, totalPages, genre, startDate, completionDate, status, description, tags, coverImage, notes, quotes, rating, review } = body;

    const updateFields = {};
    if (title) updateFields.title = title;
    if (author) updateFields.author = author;
    if (totalPages) updateFields.totalPages = totalPages;
    if (genre) updateFields.genre = genre;
    if (startDate) updateFields.startDate = startDate;
    if (completionDate) updateFields.completionDate = completionDate;
    if (status) updateFields.status = status;
    if (description) updateFields.description = description;
    if (tags) updateFields.tags = tags;
    if (coverImage) updateFields.coverImage = coverImage;
    if (notes) updateFields.notes = notes; 
    if (quotes) updateFields.quotes = quotes; 
    if (rating !== undefined) updateFields.rating = rating;
    if (review !== undefined) updateFields.review = review;


    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    const bookWithProgress = updatedBook.toObject({ virtuals: true });

    return NextResponse.json({ message: 'Book updated successfully', book: bookWithProgress }, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return NextResponse.json({ message: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
