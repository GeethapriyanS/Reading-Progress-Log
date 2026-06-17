'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProgressBar from '../components/ProgressBar';

export default function DashboardPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  // Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

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

  // --- Statistics Calculations ---
  const totalPagesRead = books.reduce((acc, book) => acc + (book.currentPage || 0), 0);
  const readingBooksCount = books.filter(book => book.status === 'Reading').length;
  const completedBooksCount = books.filter(book => book.status === 'Completed').length;

  // Genre breakdown
  const genreCounts = {};
  books.forEach(book => {
    const genre = book.genre?.trim() || 'Other';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  const totalBooks = books.length;
  const genresList = Object.entries(genreCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalBooks > 0 ? (count / totalBooks) * 100 : 0
  })).sort((a, b) => b.count - a.count);

  // SVG Donut Slices calculation
  let accumulatedPercentage = 0;
  const donutColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];
  const donutSlices = genresList.map((g, index) => {
    const strokeDasharray = `${(g.percentage * 314.16) / 100} 314.16`;
    const strokeDashoffset = `${314.16 - (accumulatedPercentage * 314.16) / 100}`;
    accumulatedPercentage += g.percentage;
    return {
      ...g,
      strokeDasharray,
      strokeDashoffset,
      color: donutColors[index % donutColors.length]
    };
  });

  // Pages read per day for the last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    last7Days.push({
      dateStr: d.toLocaleDateString(undefined, { weekday: 'short', month: 'numeric', day: 'numeric' }),
      date: d,
      pages: 0
    });
  }

  books.forEach(book => {
    if (!book.readingHistory || book.readingHistory.length === 0) return;
    const sortedHist = [...book.readingHistory].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let prevPage = 0;
    sortedHist.forEach(entry => {
      const increment = entry.page - prevPage;
      const entryDate = new Date(entry.timestamp);
      
      last7Days.forEach(day => {
        const nextDay = new Date(day.date);
        nextDay.setDate(nextDay.getDate() + 1);
        if (entryDate >= day.date && entryDate < nextDay) {
          day.pages += increment;
        }
      });
      prevPage = entry.page;
    });
  });

  const maxPagesInADay = Math.max(...last7Days.map(d => d.pages), 10);

  // --- Filtering & Sorting ---
  const getProgressPercentage = (book) => {
    if (book.totalPages === 0) return 0;
    return (book.currentPage / book.totalPages) * 100;
  };

  const processedBooks = books
    .filter(book => {
      const matchSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.tags && book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
      const matchStatus = statusFilter === 'All' || book.status === statusFilter;
      
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'progress-desc') {
        return getProgressPercentage(b) - getProgressPercentage(a);
      }
      if (sortBy === 'progress-asc') {
        return getProgressPercentage(a) - getProgressPercentage(b);
      }
      if (sortBy === 'pages-desc') {
        return b.totalPages - a.totalPages;
      }
      return 0;
    });

  const readingBooks = processedBooks.filter(book => book.status === 'Reading');
  const yetToStartBooks = processedBooks.filter(book => book.status === 'Yet to Start');
  const completedBooks = processedBooks.filter(book => book.status === 'Completed');

  const chartHeight = 120;
  const chartWidth = 320;
  const paddingLeft = 25;
  const paddingBottom = 20;
  const graphWidth = chartWidth - paddingLeft;
  const graphHeight = chartHeight - paddingBottom;
  const barWidth = Math.max((graphWidth / 7) - 6, 10);

  return (
    <div className="dashboardContainer">
      <h1>Reading Dashboard</h1>

      {loading && <p className="loadingMessage">Loading your library...</p>}
      {error && <p className="errorMessage">{error}</p>}

      {!loading && !error && (
        <>
          {/* Analytics grid */}
          <div className="analyticsGrid">
            {/* Numeric Stats */}
            <div className="statsPanel">
              <div className="miniCard">
                <h3>Total Books</h3>
                <p>{totalBooks}</p>
              </div>
              <div className="miniCard">
                <h3>Reading</h3>
                <p>{readingBooksCount}</p>
              </div>
              <div className="miniCard">
                <h3>Completed</h3>
                <p>{completedBooksCount}</p>
              </div>
              <div className="miniCard">
                <h3>Pages Logged</h3>
                <p>{totalPagesRead}</p>
              </div>
            </div>

            {/* SVG Donut Chart */}
            <div className="chartCard donutCard">
              <h3>Genre Distribution</h3>
              {genresList.length > 0 ? (
                <div className="donutContainer">
                  <svg width="150" height="150" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="transparent"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="10"
                    />
                    {donutSlices.map((slice, i) => (
                      <circle
                        key={i}
                        cx="60"
                        cy="60"
                        r="50"
                        fill="transparent"
                        stroke={slice.color}
                        strokeWidth="10"
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        transform="rotate(-90 60 60)"
                        strokeLinecap="round"
                      />
                    ))}
                    <text x="60" y="64" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      Genres
                    </text>
                  </svg>
                  <div className="donutLegend">
                    {donutSlices.slice(0, 4).map((slice, i) => (
                      <div key={i} className="legendItem">
                        <span className="legendDot" style={{ backgroundColor: slice.color }}></span>
                        <span className="legendName">{slice.name} ({slice.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="noDataText">No genres logged yet.</p>
              )}
            </div>

            {/* SVG Reading History Chart */}
            <div className="chartCard barCard">
              <h3>Pages Read (Last 7 Days)</h3>
              <div className="barChartContainer">
                <svg width="100%" height="130" viewBox="0 0 320 130" preserveAspectRatio="none">
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const yVal = 10 + graphHeight * (1 - ratio);
                    const label = Math.round(maxPagesInADay * ratio);
                    return (
                      <g key={index}>
                        <line
                          x1={paddingLeft}
                          y1={yVal}
                          x2={chartWidth}
                          y2={yVal}
                          stroke="rgba(255, 255, 255, 0.05)"
                          strokeWidth="1"
                        />
                        <text x={paddingLeft - 5} y={yVal + 3} fill="rgba(255, 255, 255, 0.4)" fontSize="7" textAnchor="end">
                          {label}
                        </text>
                      </g>
                    );
                  })}

                  {last7Days.map((day, i) => {
                    const colWidth = graphWidth / 7;
                    const x = paddingLeft + i * colWidth + 3;
                    const pct = day.pages / maxPagesInADay;
                    const h = pct * graphHeight;
                    const y = 10 + graphHeight - h;
                    
                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(h, 2)}
                          rx="2"
                          fill="url(#barGrad)"
                        />
                        <text x={x + barWidth/2} y={y - 3} fill="#06b6d4" fontSize="7" fontWeight="bold" textAnchor="middle">
                          {day.pages > 0 ? day.pages : ''}
                        </text>
                        <text x={x + barWidth/2} y={122} fill="rgba(255, 255, 255, 0.5)" fontSize="6" textAnchor="middle">
                          {day.dateStr}
                        </text>
                      </g>
                    );
                  })}
                  
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Filtering & Sorting Controls */}
          <div className="filterSortBar">
            <div className="searchWrapper">
              <input
                type="text"
                placeholder="Search by title, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="searchInput"
              />
            </div>
            <div className="selectWrapper">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filterSelect"
              >
                <option value="All">All Statuses</option>
                <option value="Reading">Currently Reading</option>
                <option value="Yet to Start">Yet to Start</option>
                <option value="Completed">Completed</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sortSelect"
              >
                <option value="recent">Recent Starts</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="progress-desc">Highest Progress</option>
                <option value="progress-asc">Lowest Progress</option>
                <option value="pages-desc">Total Pages</option>
              </select>
            </div>
          </div>

          {/* bookshelf sections */}
          <div className="shelvesContainer">
            {(statusFilter === 'All' || statusFilter === 'Reading') && (
              <section className="bookSection">
                <h2>Currently Reading</h2>
                {readingBooks.length === 0 ? (
                  <p className="noBooksMsg">No matching books currently reading.</p>
                ) : (
                  <div className="bookGrid">
                    {readingBooks.map(book => (
                      <div key={book._id} className="bookCard">
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
                          <ProgressBar currentPage={book.currentPage} totalPages={book.totalPages} />
                          <p className="progressText">Page {book.currentPage} of {book.totalPages}</p>
                          <Link href={`/book/${book._id}/update`} className="updateButton">
                            Update Progress
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {(statusFilter === 'All' || statusFilter === 'Yet to Start') && (
              <section className="bookSection">
                <h2>Yet to Start</h2>
                {yetToStartBooks.length === 0 ? (
                  <p className="noBooksMsg">No matching books in your &apos;Yet to Start&apos; list.</p>
                ) : (
                  <div className="bookGrid">
                    {yetToStartBooks.map(book => (
                      <div key={book._id} className="bookCard">
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
                          <p className="statusText">Status: Yet to Start</p>
                          <Link href={`/book/${book._id}/update`} className="updateButton startReadingBtn">
                            Start Reading
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {(statusFilter === 'All' || statusFilter === 'Completed') && (
              <section className="bookSection">
                <h2>Completed Books</h2>
                {completedBooks.length === 0 ? (
                  <p className="noBooksMsg">No matching completed books.</p>
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
                          <p className="statusText completedText">
                            Completed: {book.completionDate ? new Date(book.completionDate).toLocaleDateString() : 'Yes'}
                          </p>
                          {book.rating && (
                            <div className="ratingDisplay">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i} className={`starDisplay ${i < book.rating ? 'filled' : ''}`}>&#9733;</span>
                              ))}
                            </div>
                          )}
                          <Link href={`/book/${book._id}`} className="viewReviewBtn">
                            View Review
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}