'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import LoginPopupHandler from './LoginPopUpHandler';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('userId', data.userId);
        window.location.href = '/dashboard';
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
        Don&apos;t have an account? <Link href="/register">Sign Up</Link>
      </div>
      <Suspense fallback={<></>}>
        <LoginPopupHandler />
      </Suspense>
    </div>
  );
}
