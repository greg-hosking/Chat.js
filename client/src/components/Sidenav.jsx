import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Sidenav() {
  const shouldFetch = useRef(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch('/api/users/me', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        // alert('You do not have permission to access this page.');
        navigate('/sign-in', { replace: true });
        return;
      }

      const result = await response.json();
      setUser(result);
      setLoading(false);
    }
    if (shouldFetch.current) {
      fetchUser();
      shouldFetch.current = false;
    }
  }, [user]);

  return (
    <nav>
      <Link to='/rooms' id='nav-brand'>
        <h1>Chat.js</h1>
      </Link>
      <Link to='/settings' id='nav-user'>
        {loading ? (
          <>
            <img
              src='https://s3.amazonaws.com/chat.js/icons/user.png'
              draggable={false}
            />
            <h3>Loading...</h3>
          </>
        ) : (
          <>
            <img
              src={user.portrait}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://s3.amazonaws.com/chat.js/icons/user.png';
              }}
              draggable={false}
            />
            <h3 style={{ color: user.usernameColor }}>{user.username}</h3>
          </>
        )}
      </Link>
      <Link to='/settings' id='nav-user-mobile' className='nav-item'>
        {loading ? (
          <img
            src='https://s3.amazonaws.com/chat.js/icons/user.png'
            draggable={false}
          />
        ) : (
          <img
            src={user.portrait}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://s3.amazonaws.com/chat.js/icons/user.png';
            }}
            draggable={false}
          />
        )}
      </Link>
      <Link to='/rooms' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/rooms.png'
          draggable={false}
        />
        <h3>Rooms</h3>
      </Link>
      <Link to='/friends' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/friends.png'
          draggable={false}
        />
        <h3>Friends</h3>
      </Link>
      <Link to='/settings' className='nav-item'>
        <img
          src='https://s3.amazonaws.com/chat.js/icons/settings.png'
          draggable={false}
        />
        <h3>Settings</h3>
      </Link>
      <Link
        to='/sign-in'
        className='nav-item'
        onClick={() => {
          fetch('/api/auth', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
        }}
      >
        <img
          src='https://s3.amazonaws.com/chat.js/icons/sign-out.png'
          draggable={false}
        />
        <h3>Sign Out</h3>
      </Link>
    </nav>
  );
}
