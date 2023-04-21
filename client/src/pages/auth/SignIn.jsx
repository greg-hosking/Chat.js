import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleFormSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      localStorage.setItem('userId', result.userId);
      navigate('/rooms');
      return;
    }

    alert(response.status);
  }

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Sign In</h1>
        <div>
          <label htmlFor='username-input'>Username</label>
          <input
            type='username'
            name='username-input'
            id='username-input'
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor='password-input'>Password</label>
          <input
            type='password'
            name='password-input'
            id='password-input'
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <a href='/forgot-password' id='forgot-password-link'>
            Forgot password?
          </a>
        </div>
        <input type='submit' />
        <p>
          Don't have an account? <a href='/sign-up'>Sign up.</a>
        </p>
      </form>
    </div>
  );
}
