'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useReducer } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    
    if(userId){
      setIsLoggedIn(true);
    }else{
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    alert('Logged out successfully!');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Add Book', href: '/add-book' },
    { name: 'Goals', href: '/goals' },
    { name: 'Completed', href: '/completed' },
  ];

  return (
    <nav className="navbar"> 
      <div className="logo"> 
        <Link href="/">Reading Log</Link>
      </div>
      <ul className="navLinks"> 
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`navItem ${pathname === link.href ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          </li>
        ))}

        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="logoutButton"> {/* Changed from styles.logoutButton to "logoutButton" */}
              Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link
                href="/login"
                className={`navItem ${pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className={`navItem ${pathname === '/register' ? 'active' : ''}`}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}