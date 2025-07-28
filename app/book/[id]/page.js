'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProgressBar from '../../components/ProgressBar';

export default function BookDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [quoteContent, setQuoteContent] = useState('');
  const [quotePage, setQuotePage] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(0);

  const fetchBookDetails = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        if (data.book.review) setReviewContent(data.book.review);
        if (data.book.rating) setRating(data.book.rating);
      } else {
        setError(data.message || 'Failed to fetch book details.');
      }
    } catch (err) {
      console.error('Error fetching book details:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id, fetchBookDetails]); 

  const handleMarkAsCompleted = async () => {
    if (!book) return;
    try {
      const res = await fetch(`/api/books/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPage: book.totalPages }),
      });
      const data = await res.json();

      if (res.ok) {
        setBook(data.book);
        alert('Book marked as completed!');
      } else {
        alert(data.message || 'Failed to mark as completed.');
      }
    } catch (err) {
      console.error('Error marking as completed:', err);
      alert('An error occurred.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteContent.trim() || !book) return;
    try {
      const updatedNotes = [...(book.notes || []), { content: noteContent, timestamp: new Date() }];
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: updatedNotes }),
      });
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        setNoteContent('');
      } else {
        alert(data.message || 'Failed to add note.');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      alert('An error occurred.');
    }
  };

  const handleAddQuote = async (e) => {
    e.preventDefault();
    if (!quoteContent.trim() || !book || !quotePage) return;
    try {
      const updatedQuotes = [...(book.quotes || []), { content: quoteContent, page: parseInt(quotePage), timestamp: new Date() }];
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quotes: updatedQuotes }),
      });
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        setQuoteContent('');
        setQuotePage('');
      } else {
        alert(data.message || 'Failed to add quote.');
      }
    } catch (err) {
      console.error('Error adding quote:', err);
      alert('An error occurred.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!book) return;
    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review: reviewContent, rating: rating }),
      });
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        alert('Review and rating updated!');
      } else {
        alert(data.message || 'Failed to update review/rating.');
      }
    } catch (err) {
      console.error('Error updating review/rating:', err);
      alert('An error occurred.');
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p className="errorMessage">{error}</p>; 
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="bookDetailsContainer"> 
      <h1>{book.title}</h1>
      <p className="author">by {book.author}</p> 
      <p className="genre">Genre: {book.genre || 'N/A'}</p> 
      <p className="pages">Total Pages: {book.totalPages}</p> 
      <p className="status">Status: {book.status}</p> 
      {book.startDate && <p>Started: {new Date(book.startDate).toLocaleDateString()}</p>}
      {book.completionDate && <p>Completed: {new Date(book.completionDate).toLocaleDateString()}</p>}

      <h2 className="sectionTitle">Reading Progress</h2> 
      <ProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />
      <p className="progressText"> 
        Page {book.currentPage} of {book.totalPages} ({book.progress.toFixed(1)}%)
      </p>

      <div className="actionButtons"> 
        <Link href={`/book/${id}/update`} className="updateProgressButton"> {/* Replaced styles.updateProgressButton */}
          Update Progress
        </Link>
        {book.status === 'Reading' && (
          <button onClick={handleMarkAsCompleted} className="markCompletedButton"> {/* Replaced styles.markCompletedButton */}
            Mark as Completed
          </button>
        )}
      </div>

      {book.description && (
        <>
          <h2 className="sectionTitle">Description</h2> 
          <p className="description">{book.description}</p> 
        </>
      )}

      {book.tags && book.tags.length > 0 && (
        <>
          <h2 className="sectionTitle">Tags</h2>
          <div className="tags"> 
            {book.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </>
      )}

      <h2 className="sectionTitle">Notes</h2> 
      <form onSubmit={handleAddNote} className="noteForm"> 
        <textarea
          placeholder="Add a new note..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          rows="3"
        ></textarea>
        <button type="submit">Add Note</button>
      </form>
      <ul className="notesList"> 
        {book.notes && book.notes.length > 0 ? (
          book.notes.slice().reverse().map((note, index) => (
            <li key={index} className="noteItem"> 
              <p>{note.content}</p>
              <span className="noteTimestamp"> 
                {new Date(note.timestamp).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <p>No notes for this book yet.</p>
        )}
      </ul>

      <h2 className="sectionTitle">Quotes</h2> 
      <form onSubmit={handleAddQuote} className="quoteForm"> 
        <textarea
          placeholder="Add a new quote..."
          value={quoteContent}
          onChange={(e) => setQuoteContent(e.target.value)}
          rows="3"
        ></textarea>
        <input
          type="number"
          placeholder="Page number (optional)"
          value={quotePage}
          onChange={(e) => setQuotePage(e.target.value)}
          min="1"
          max={book.totalPages}
        />
        <button type="submit">Add Quote</button>
      </form>
      <ul className="quotesList"> 
        {book.quotes && book.quotes.length > 0 ? (
          book.quotes.slice().reverse().map((quote, index) => (
            <li key={index} className="quoteItem"> 
              <p>&quot;{quote.content}&quot;</p> 
              <span className="quoteDetails"> 
                {quote.page ? `Page ${quote.page} | ` : ''}
                {new Date(quote.timestamp).toLocaleString()}
              </span>
            </li>
          ))
        ) : (
          <p>No quotes for this book yet.</p>
        )}
      </ul>

      <h2 className="sectionTitle">Review & Rating</h2>
      {book.status === 'Completed' ? (
        <form onSubmit={handleSubmitReview} className="reviewForm"> 
          <div className="ratingSection"> 
            <label>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? 'filledStar' : ''}`} 
                onClick={() => setRating(star)}
              >
                &#9733;
              </span>
            ))}
          </div>
          <textarea
            placeholder="Write your review here..."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            rows="5"
          ></textarea>
          <button type="submit">Save Review</button>
        </form>
      ) : (
        <p>You can add a review and rating once the book is completed.</p>
      )}

      <h2 className="sectionTitle">Reading History</h2> 
      {book.readingHistory && book.readingHistory.length > 0 ? (
        <ul className="historyList"> 
          {book.readingHistory.slice().reverse().map((entry, index) => (
            <li key={index}>
              Read up to page {entry.page} on {new Date(entry.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No reading history yet.</p>
      )}

      <button
        onClick={async () => {
          if (window.confirm('Are you sure you want to delete this book?')) {
            try {
              const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
              if (res.ok) {
                alert('Book deleted successfully!');
                router.push('/dashboard');
              } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete book.');
              }
            } catch (err) {
              console.error('Error deleting book:', err);
              alert('An error occurred during deletion.');
            }
          }
        }}
        className="deleteButton" 
      >
        Delete Book
      </button>
    </div>
  );
}