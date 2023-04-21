import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Verification() {
  const [loading, setLoading] = useState(true);
  const shouldVerifyToken = useRef(true);

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    async function verifyToken() {
      const response = await fetch('/api/auth/verification', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setLoading(false);

      if (!response.ok) {
        alert(await response.text());
        return;
      }

      // Wait for one second before redirecting to sign in page.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location = 'http://localhost:3000/sign-in';
    }
    if (shouldVerifyToken.current) {
      verifyToken();
      shouldVerifyToken.current = false;
    }
  }, []);

  return (
    <div className='content-container content-container-sm'>
      <form>
        {loading ? (
          <>
            <p>Verifying</p>
            <p>Please wait...</p>
          </>
        ) : (
          <>
            <p>Verification complete!</p>
            <p>Redirecting...</p>
          </>
        )}
      </form>
    </div>
  );
}
