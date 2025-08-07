'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PopupMessage from '../components/PopUp';

export default function LoginPopupHandler() {
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
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

  return (
    <>
      {popupMessage && (
        <PopupMessage message={popupMessage} type={popupType} onClose={handlePopupClose} />
      )}
    </>
  );
}