'use client';

import { useEffect } from 'react';

const PopupMessage=({ message, type, onClose }) =>{
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const popupClasses = `popup-container ${type === 'success' ? 'popup-success' : 'popup-error'}`;

  return (
    <div className={popupClasses}>
      <p>{message}</p>
      <button onClick={onClose}>&times;</button>
    </div>
  );
}
export default PopupMessage;