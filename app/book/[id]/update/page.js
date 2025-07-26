// app/book/[id]/update/page.js
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProgressBar from '../../../components/ProgressBar';
import styles from './style.module.css'; // Create this CSS file

export default function UpdateProgressPage() {
  const { id } = useParams(); // Book ID
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [currentPageInput, setCurrentPageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBookForUpdate();
    }
  }, [id]);

  const fetchBookForUpdate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        setCurrentPageInput(data.book.currentPage.toString()); // Set initial value
      } else {
        setError(data.message || 'Failed to fetch book for update.');
      }
    } catch (err) {
      console.error('Error fetching book for update:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newCurrentPage = parseInt(currentPageInput, 10);

    if (isNaN(newCurrentPage) || newCurrentPage < 0) {
      setError('Please enter a valid page number.');
      return;
    }
    if (newCurrentPage > book.totalPages) {
      setError(`Current page cannot exceed total pages (${book.totalPages}).`);
      return;
    }

    try {
      const res = await fetch(`/api/books/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPage: newCurrentPage }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Reading progress updated successfully!');
        router.push(`/book/${id}`); 
      } else {
        setError(data.message || 'Failed to update progress.');
      }
    } catch (err) {
      console.error('Error updating progress:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) return <p>Loading book data...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className={styles.updateProgressContainer}>
      <h1>Update Progress for "{book.title}"</h1>
      <p className={styles.author}>by {book.author}</p>
      <p className={styles.pages}>Total Pages: {book.totalPages}</p>

      <div className={styles.currentProgress}>
        <h2>Current Progress:</h2>
        <ProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />
        <p className={styles.progressText}>Page {book.currentPage} of {book.totalPages}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.updateForm}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPage">Enter New Current Page Number:</label>
          <input
            type="number"
            id="currentPage"
            value={currentPageInput}
            onChange={(e) => setCurrentPageInput(e.target.value)}
            min="0"
            max={book.totalPages}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Update Progress</button>
      </form>
    </div>
  );
}