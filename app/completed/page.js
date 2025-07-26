// app/completed/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './style.module.css'; // Create this CSS file

export default function CompletedBooksPage() {
  const [completedBooks, setCompletedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchCompletedBooks(storedUserId);
    } else {
      setError('User not authenticated. Please log in.');
      setLoading(false);
    }
  }, []);

  const fetchCompletedBooks = async (currentUserId) => {
    setLoading(true);
    setError('');
    try {
      // You might want to add a `status=Completed` query param if your API handles it
      const res = await fetch(`/api/books?userId=${currentUserId}&status=Completed`);
      const data = await res.json();
      if (res.ok) {
        setCompletedBooks(data.books.filter(book => book.status === 'Completed'));
      } else {
        setError(data.message || 'Failed to fetch completed books.');
      }
    } catch (err) {
      console.error('Error fetching completed books:', err);
      setError('An unexpected error occurred while fetching completed books.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.completedBooksContainer}>
      <h1>Completed Books</h1>

      {loading && <p>Loading completed books...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && completedBooks.length === 0 ? (
        <p className={styles.noBooksMessage}>You haven't completed any books yet. Keep reading!</p>
      ) : (
        <div className={styles.bookGrid}>
          {completedBooks.map(book => (
            <div key={book._id} className={styles.bookCard}>
              <Link href={`/book/${book._id}`} className={styles.bookTitleLink}>
                <h3>{book.title}</h3>
              </Link>
              <p>by {book.author}</p>
              {book.completionDate && <p className={styles.completionDate}>Completed on: {new Date(book.completionDate).toLocaleDateString()}</p>}
              {book.rating > 0 && <p className={styles.rating}>Rating: {book.rating}/5</p>}
              {book.review && <p className={styles.review}>"{book.review.substring(0, 100)}{book.review.length > 100 ? '...' : ''}"</p>}
              <Link href={`/book/${book._id}`} className={styles.viewDetailsButton}>
                View Details & Review
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}