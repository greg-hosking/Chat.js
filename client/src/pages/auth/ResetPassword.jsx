import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (password1 !== password2) {
      alert('Passwords do not match.');
      return;
    }

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: password1,
      }),
    });

    alert(await response.text());

    if (response.ok) {
      window.location.href = '/sign-in';
    }
  }

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Reset Password</h1>
        <div>
          <label htmlFor='password1-input'>Password</label>
          <input
            type='password'
            name='password1-input'
            id='password1-input'
            required={true}
            value={password1}
            onChange={(e) => {
              setPassword1(e.target.value);
              setPassword2('');
            }}
          />
        </div>
        <div>
          <label htmlFor='password2-input'>Confirm Password</label>
          <input
            type='password'
            name='password2-input'
            id='password2-input'
            required={true}
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
            }}
          />
        </div>
        <input type='submit' />
        <p>
          Don't have an account? <a href='/sign-up'>Sign up.</a>
        </p>
      </form>
    </div>
  );
}
