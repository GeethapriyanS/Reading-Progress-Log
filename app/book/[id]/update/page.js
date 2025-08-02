'use client';

import { useState, useEffect, useCallback } from 'react'; 
import { useParams, useRouter } from 'next/navigation';
import ProgressBar from '../../../components/ProgressBar';

export default function UpdateProgressPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [currentPageInput, setCurrentPageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookForUpdate = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      if (res.ok) {
        setBook(data.book);
        setCurrentPageInput(data.book.currentPage.toString());
      } else {
        setError(data.message || 'Failed to fetch book for update.');
      }
    } catch (err) {
      console.error('Error fetching book for update:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    if (id) {
      fetchBookForUpdate();
    }
  }, [id, fetchBookForUpdate]); 

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
  if (error) return <p className="errorMessage">{error}</p>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="updateProgressContainer"> 
      <h1>Update Progress for &quot;{book.title}&quot;</h1> 
      <p className="author">by {book.author}</p> 
      <p className="pages">Total Pages: {book.totalPages}</p> 

      <div className="currentProgress">
        <h2>Current Progress:</h2>
        <ProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />
        <p className="progressText">Page {book.currentPage} of {book.totalPages}</p> {/* Replaced styles.progressText */}
      </div>

      <form onSubmit={handleSubmit} className="updateForm"> 
        <div className="formGroup">
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
        <button type="submit" className="submitButton">Update Progress</button> 
      </form>
    </div>
  );
}