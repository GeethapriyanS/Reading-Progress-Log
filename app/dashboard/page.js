'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '../components/ProgressBar';

export default function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchBooks(storedUserId);
    } else {
      setError('User not authenticated. Please log in.');
      setLoading(false);
    }
  }, []);

  const fetchBooks = async (currentUserId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books?userId=${currentUserId}`);
      const data = await res.json();
      if (res.ok) {
        setBooks(data.books);
      } else {
        setError(data.message || 'Failed to fetch books.');
      }
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('An unexpected error occurred while fetching books.');
    } finally {
      setLoading(false);
    }
  };

  const readingBooks = books.filter(book => book.status === 'Reading');
  const completedBooks = books.filter(book => book.status === 'Completed');
  const yetToStartBooks = books.filter(book => book.status === 'Yet to Start');

  return (
    <div className="dashboardContainer">
      <h1>Your Reading Dashboard</h1>

      {loading && <p>Loading books...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading && !error && (
        <>
          <div className="metrics">
            <div className="metricCard">
              <h3>Total Books Logged</h3>
              <p>{books.length}</p>
            </div>
            <div className="metricCard">
              <h3>Books Currently Reading</h3>
              <p>{readingBooks.length}</p>
            </div>
            <div className="metricCard">
              <h3>Books Completed</h3>
              <p>{completedBooks.length}</p>
            </div>
          </div>

          <section className="bookSection">
            <h2>Currently Reading</h2>
            {readingBooks.length === 0 ? (
              <p>No books currently reading. <Link href="/add-book" className="link-hyp">Add a new book</Link> to start!</p>
            ) : (
              <div className="bookGrid">
                {readingBooks.map(book => (
                  <div key={book._id} className="bookCard">
                    <Link href={`/book/${book._id}`} className="bookTitleLink">
                      <h3>{book.title}</h3>
                    </Link>
                    <p>by {book.author}</p>
                    <ProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />
                    <p className="progressText">Page {book.currentPage}  {book.totalPages}</p>
                    <Link href={`/book/${book._id}/update`} className="updateButton">
                      Update Progress
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bookSection">
            <h2>Yet to Start</h2>
            {yetToStartBooks.length === 0 ? (
              <p>No books in your 'Yet to Start' list.</p>
            ) : (
              <div className="bookGrid">
                {yetToStartBooks.map(book => (
                  <div key={book._id} className="bookCard">
                    <Link href={`/book/${book._id}`} className="bookTitleLink">
                      <h3>{book.title}</h3>
                    </Link>
                    <p>by {book.author}</p>
                    <p className="statusText">Status: Yet to Start</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bookSection">
            <h2>Completed Books</h2>
            {completedBooks.length === 0 ? (
              <p>No books completed yet. Keep reading!</p>
            ) : (
              <div className="bookGrid">
                {completedBooks.map(book => (
                  <div key={book._id} className="bookCard">
                    <Link href={`/book/${book._id}`} className="bookTitleLink">
                      <h3>{book.title}</h3>
                    </Link>
                    <p>by {book.author}</p>
                    <p className="statusText">Completed on: {new Date(book.completionDate).toLocaleDateString()}</p>
                    {book.rating && <p>Rating: {book.rating}/5</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}