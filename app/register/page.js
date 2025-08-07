'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PopupMessage from '../components/PopUp';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const router = useRouter();

  const handlePopupClose = () => {
    setPopupMessage('');
    if (popupType === 'success') {
      router.push('/login?registered=true');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPopupMessage('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setPopupMessage('Registration successful!');
        setPopupType('success');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container1">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form">
        {error && <p className="errorMessage">{error}</p>}
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <button type="submit" className="submitButton1">Register</button>
      </form>
      <div className="formLink">
        Already have an account? <Link href="/login">Login</Link>
      </div>
      {popupMessage && (
        <PopupMessage message={popupMessage} type={popupType} onClose={handlePopupClose} />
      )}
    </div>
  );
}
