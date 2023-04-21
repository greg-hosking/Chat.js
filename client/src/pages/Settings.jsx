import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [newUsernameColor, setNewUsernameColor] = useState('');
  const [loading, setLoading] = useState(true);
  const shouldFetch = useRef(true);
  const navigate = useNavigate();

  async function handleColorFormSubmit(event) {
    event.preventDefault();
    const response = await fetch('/api/users/me/usernameColor', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usernameColor: newUsernameColor }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    const result = await response.json();
    setUser(result);
    setNewUsernameColor(result.usernameColor);
    window.location.reload();
  }

  async function handleImageFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', event.target[0].files[0]);

    const response = await fetch('/api/users/me/portrait', {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      alert(response.status);
    } else {
      alert('Image uploaded successfully');
    }
    const result = await response.json();
    setUser(result);
    window.location.reload();
  }

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
      setNewUsernameColor(result.usernameColor);
      setLoading(false);
    }
    if (shouldFetch.current) {
      fetchUser();
      shouldFetch.current = false;
    }
  }, []);

  return (
    <div className='content-container content-container-lg settings-container'>
      <h2>Settings</h2>
      {loading ? (
        <h3>Loading</h3>
      ) : (
        <>
          <form
            onSubmit={(e) => {
              handleColorFormSubmit(e);
            }}
          >
            <p>
              <b>Username:</b>{' '}
              <span style={{ color: newUsernameColor }}>{user.username}</span>
            </p>
            <input
              type='color'
              value={newUsernameColor}
              onChange={(e) => {
                setNewUsernameColor(e.target.value);
              }}
            />
            <input
              type='image'
              src='https://s3.amazonaws.com/chat.js/icons/checkmark.png'
              disabled={newUsernameColor === user.usernameColor}
            />
            <input
              type='image'
              src='https://s3.amazonaws.com/chat.js/icons/cancel.png'
              disabled={newUsernameColor === user.usernameColor}
              onClick={(e) => {
                e.preventDefault();
                setNewUsernameColor(user.usernameColor);
              }}
            />
          </form>

          <p>
            <b>Email:</b>
            {user.email}
          </p>
          <p>
            <b>Created at:</b> {new Date(user.createdAt).toLocaleString()}
          </p>
          <p>
            <b>Updated at:</b> {new Date(user.updatedAt).toLocaleString()}
          </p>
          <p>
            <b>Profile picture:</b>
          </p>
          <img
            src={user.portrait}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://s3.amazonaws.com/chat.js/icons/user.png';
            }}
            draggable={false}
          />
          <form
            onSubmit={(e) => {
              handleImageFormSubmit(e);
            }}
          >
            <input type='file' required={true} />
            <input
              type='image'
              src='https://s3.amazonaws.com/chat.js/icons/upload.png'
            />
          </form>
        </>
      )}
    </div>
  );
}
