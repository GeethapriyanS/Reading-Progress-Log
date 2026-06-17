'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <div className="completedBooksContainer">
      <h1>Completed Books</h1>

      {loading && <p>Loading completed books...</p>}
      {error && <p className="errorMessage">{error}</p>} 

      {!loading && !error && completedBooks.length === 0 ? (
        <p className="noBooksMessage">You haven&apos;t completed any books yet. Keep reading!</p> 
      ) : (
        <div className="bookGrid"> 
          {completedBooks.map(book => (
            <div key={book._id} className="bookCard completedCard"> 
              {book.coverImage && (
                <div className="bookCoverWrapper">
                  <img src={book.coverImage} alt={book.title} className="bookCoverImg" />
                </div>
              )}
              <div className="bookCardDetails">
                <Link href={`/book/${book._id}`} className="bookTitleLink"> 
                  <h3>{book.title}</h3>
                </Link>
                <p className="authorName">by {book.author}</p>
                {book.completionDate && <p className="completionDate" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Completed: {new Date(book.completionDate).toLocaleDateString()}</p>} 
                {book.rating > 0 && (
                  <div className="ratingDisplay" style={{ marginBottom: '8px' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`starDisplay ${i < book.rating ? 'filled' : ''}`}>&#9733;</span>
                    ))}
                  </div>
                )}
                {book.review && <p className="review" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '12px', lineHeight: '1.4' }}>&quot;{book.review.substring(0, 100)}{book.review.length > 100 ? '...' : ''}&quot;</p>} 
                <Link href={`/book/${book._id}`} className="viewReviewBtn" style={{ marginTop: 'auto' }}> 
                  View Details & Review
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}