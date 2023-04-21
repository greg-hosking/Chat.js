import React, { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  async function handleFormSubmit(event) {
    event.preventDefault();

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    alert(await response.text());
  }

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        <h1>Forgot Password</h1>
        <div>
          <label htmlFor='email-input'>Email</label>
          <input
            type='email'
            name='email-input'
            id='email-input'
            required={true}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
