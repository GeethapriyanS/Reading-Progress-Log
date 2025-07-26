'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    totalPages: '',
    genre: '',
    startDate: '',
    description: '',
    tags: '',
    coverImage: '',
    userId: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setFormData((prevData) => ({
        ...prevData,
        userId: storedUserId,
      }));
    } else {
      setError('You must be logged in to add a book. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.userId) {
      setError('User not authenticated. Please log in.');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalPages: parseInt(formData.totalPages, 10),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setFormData({
          title: '',
          author: '',
          totalPages: '',
          genre: '',
          startDate: '',
          description: '',
          tags: '',
          coverImage: '',
          userId: formData.userId,
        });
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to add book');
      }
    } catch (err) {
      console.error('Error adding book:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>Add New Book</h1>
      <form onSubmit={handleSubmit} className="form">
        {message && <p className="successMessage">{message}</p>}
        {error && <p className="errorMessage">{error}</p>}

        <div className="formGroup">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="totalPages">Total Pages</label>
          <input
            type="number"
            id="totalPages"
            name="totalPages"
            value={formData.totalPages}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
          />
        </div>

        <div className="formGroup">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="formGroup">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="formGroup">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., fantasy, adventure, fiction"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="coverImage">Cover Image URL</label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submitButton">Add Book</button>
      </form>
    </div>
  );
}