import React from 'react';

const ProgressBar = ({ currentPage, totalPages }) => {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <div style={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
      <div
        style={{
          width: `${progress}%`,
          backgroundColor: '#4CAF50',
          height: '20px',
          borderRadius: '5px',
          textAlign: 'center',
          color: 'white',
          lineHeight: '20px',
          fontSize: '0.8em',
        }}
      >
        {`${Math.round(progress)}%`}
      </div>
    </div>
  );
};

export default ProgressBar;