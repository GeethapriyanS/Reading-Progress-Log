'use client';

import { useState, useEffect } from 'react';
import ProgressBar from '../components/ProgressBar';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newGoal, setNewGoal] = useState({ type: 'pages', target: '', endDate: '' });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchGoals(storedUserId);
    } else {
      setError('User not authenticated. Please log in to manage goals.');
      setLoading(false);
    }
  }, []);

  const fetchGoals = async (currentUserId) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/goals?userId=${currentUserId}`);
      const data = await res.json();
      if (res.ok) {
        setGoals(data.goals);
      } else {
        setError(data.message || 'Failed to fetch goals.');
      }
    } catch (err) {
      console.error('Error fetching goals:', err);
      setError('An unexpected error occurred while fetching goals.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setError('');
    if (!newGoal.target || !newGoal.endDate) {
      setError('Please fill all goal fields.');
      return;
    }
    if (newGoal.target <= 0) {
      setError('Target must be greater than 0.');
      return;
    }

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          target: parseInt(newGoal.target, 10),
          userId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Goal added successfully!');
        setNewGoal({ type: 'pages', target: '', endDate: '' });
        fetchGoals(userId);
      } else {
        setError(data.message || 'Failed to add goal.');
      }
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('An unexpected error occurred while adding the goal.');
     fungicide;
    }
  };

  const calculateGoalProgress = (goal) => {
    return goal.progress;
  };

  return (
    <div className="goalsContainer">
      <h1>Your Reading Goals</h1>

      <section className="addGoalSection">
        <h2>Set a New Goal</h2>
        <form onSubmit={handleAddGoal} className="goalForm">
          {error && <p className="errorMessage">{error}</p>}
          <div className="formGroup">
            <label htmlFor="goalType">Goal Type:</label>
            <select
              id="goalType"
              name="type"
              value={newGoal.type}
              onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value })}
            >
              <option value="pages">Total Pages</option>
              <option value="books">Number of Books</option>
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="target">Target ({newGoal.type === 'pages' ? 'Pages' : 'Books'}):</label>
            <input
              type="number"
              id="target"
              name="target"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              min="1"
              required
            />
          </div>
          <div className="formGroup">
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={newGoal.endDate}
              onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="submitButton">Add Goal</button>
        </form>
      </section>

      <section className="currentGoalsSection">
        <h2>Your Active Goals</h2>
        {loading && <p>Loading goals...</p>}
        {!loading && goals.length === 0 && !error && (
          <p>No goals set yet. Set a new goal above!</p>
        )}
        {!loading && error && <p className="errorMessage">{error}</p>}

        <div className="goalGrid">
          {goals.map(goal => (
            <div key={goal._id} className="goalCard">
              <h3>{goal.type === 'pages' ? 'Read' : 'Read'} {goal.target} {goal.type}</h3>
              <p>By: {new Date(goal.endDate).toLocaleDateString()}</p>
              <ProgressBar currentPage={goal.progress} totalPages={goal.target} />
              <p className="progressText">
                {goal.progress} of {goal.target} {goal.type} ({goal.progressPercentage.toFixed(1)}%)
              </p>
              <p className={`goalStatus ${goal.isCompleted ? 'completed' : 'active'}`}>
                Status: {goal.isCompleted ? 'Completed!' : 'Active'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}