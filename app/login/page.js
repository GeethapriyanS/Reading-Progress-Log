'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PopupMessage from '../components/PopUp';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setPopupMessage('Registration successful! Please log in.');
      setPopupType('success');
    }
  }, [searchParams]);

  const handlePopupClose = () => {
    setPopupMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPopupMessage('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        setPopupMessage('Login successful!');
        setPopupType('success');
        window.location.href = '/dashboard'
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container1">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="errorMessage">{error}</p>}
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submitButton1">Login</button>
      </form>
      <div className="formLink">
        Don't have an account? <Link href="/register">Sign Up</Link>
      </div>
      {popupMessage && (
        <PopupMessage message={popupMessage} type={popupType} onClose={handlePopupClose} />
      )}
    </div>
  );
}
