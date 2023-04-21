import React, { useState } from 'react';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  async function handleFormSubmit(event) {
    event.preventDefault();

    if (!(username && email && password1 && password2)) {
      alert('');
      return;
    }

    if (password1 !== password2) {
      alert('Passwords do not match.');
      setPassword1('');
      setPassword2('');
      return;
    }

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password1,
      }),
    });

    if (!response.ok) {
      alert(response.status);
      return;
    }

    setEmailSent(true);
  }

  return (
    <div className='content-container content-container-sm'>
      <form
        onSubmit={(event) => {
          handleFormSubmit(event);
        }}
      >
        {emailSent ? (
          <>
            <p>Account successfully created!</p>
            <p>
              Verification email sent to{' '}
              <b style={{ color: '#3d91f4' }}>{email}</b>
            </p>
          </>
        ) : (
          <>
            <h1>Sign Up</h1>
            <div>
              <label htmlFor='username-input'>Username</label>
              <input
                type='username'
                name='username-input'
                id='username-input'
                required={true}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
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
              Already have an account? <a href='/sign-in'>Sign in.</a>
            </p>
          </>
        )}
      </form>
    </div>
  );
}
