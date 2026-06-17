import React from 'react';

const ProgressBar = ({ currentPage, totalPages }) => {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', overflow: 'hidden', height: '14px', position: 'relative' }}>
      <div
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
          height: '100%',
          borderRadius: '4px',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
    </div>
  );
};

export default ProgressBar;