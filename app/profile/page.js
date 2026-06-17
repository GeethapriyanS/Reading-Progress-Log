'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // User Profile Data
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  // Edit Forms state
  const [usernameInput, setUsernameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password edit state
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId);
    } else {
      setError('You must be logged in to view your profile. Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  }, [router]);

  const fetchUserProfile = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/user/${id}`);
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setStats(data.stats);
        setUsernameInput(data.user.username);
        setEmailInput(data.user.email);
      } else {
        setError(data.message || 'Failed to fetch profile details.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('An unexpected error occurred while loading profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usernameInput.trim() || !emailInput.trim()) {
      setError('Username and email cannot be empty.');
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput,
          email: emailInput,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setProfile(data.user);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordError('An unexpected error occurred. Please try again.');
    }
  };

  if (loading) return <div className="main-content"><p className="noBooksMsg">Loading profile details...</p></div>;

  return (
    <div className="goalsContainer" style={{ maxWidth: '1000px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Profile Card Header */}
      {profile && (
        <div className="addGoalSection" style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: 'var(--shadow-glow)'
          }}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ marginBottom: '4px', fontSize: '1.8rem', background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'left', borderBottom: 'none', paddingBottom: '0' }}>
              {profile.username}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>{profile.email}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="statsPanel" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', width: '100%', gap: '16px' }}>
          <div className="miniCard">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
          <div className="miniCard">
            <h3>Books Completed</h3>
            <p>{stats.completedBooks}</p>
          </div>
          <div className="miniCard">
            <h3>Total Pages Read</h3>
            <p>{stats.totalPagesRead}</p>
          </div>
          <div className="miniCard">
            <h3>Goals Achieved</h3>
            <p>{stats.completedGoals} of {stats.totalGoals}</p>
          </div>
        </div>
      )}

      {/* Settings Forms */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', width: '100%' }}>
        
        {/* Edit Profile Form */}
        <div className="addGoalSection" style={{ flex: '1 1 400px', marginBottom: '0' }}>
          <h2 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '24px', textAlign: 'left' }}>Edit Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            {success && <p className="successMessage" style={{ marginBottom: '16px', display: 'block', width: '100%' }}>{success}</p>}
            {error && !loading && <p className="errorMessage" style={{ marginBottom: '16px', display: 'block', width: '100%' }}>{error}</p>}
            
            <div className="formGroup">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submitButton">Update Details</button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="addGoalSection" style={{ flex: '1 1 400px', marginBottom: '0' }}>
          <h2 style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px', marginBottom: '24px', textAlign: 'left' }}>Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {passwordSuccess && <p className="successMessage" style={{ marginBottom: '16px', display: 'block', width: '100%' }}>{passwordSuccess}</p>}
            {passwordError && <p className="errorMessage" style={{ marginBottom: '16px', display: 'block', width: '100%' }}>{passwordError}</p>}
            
            <div className="formGroup">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="formGroup">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submitButton">Change Password</button>
          </form>
        </div>

      </div>

    </div>
  );
}
