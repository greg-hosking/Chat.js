import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import UserCard from '../components/UserCard';

export default function Friends() {
  const [user, setUser] = useState(null);
  const [friendUsername, setFriendUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const shouldFetch = useRef(true);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch('/api/users/me/friendRequests', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendUsername }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    await response.json();
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
      setLoading(false);
    }
    if (shouldFetch.current) {
      fetchUser();
      shouldFetch.current = false;
    }
  }, [user]);

  return (
    <>
      <div className='content-container content-container-lg friends-container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>
              Friends {user.friends.length > 0 && `(${user.friends.length})`}
            </h2>
            {user.friends.length === 0 ? (
              <p className='no-friends-label'>Nothing to see here...</p>
            ) : (
              <div className='friend-cards-container'>
                {user.friends.map((userId, index) => (
                  <UserCard key={index} userId={userId} type='friend' />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className='content-container content-container-lg friend-requests-container'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2>Friend Requests</h2>
            <h3>
              Incoming{' '}
              {user.friendRequests.incoming.length > 0 &&
                `(${user.friendRequests.incoming.length})`}
            </h3>
            {user.friendRequests.incoming.length === 0 ? (
              <p className='no-friend-requests-label'>
                You have no incoming friend requests.
              </p>
            ) : (
              <div className='friend-request-cards-container'>
                {user.friendRequests.incoming.map((userId, index) => (
                  <UserCard
                    key={index}
                    userId={userId}
                    type='incoming friend request'
                  />
                ))}
              </div>
            )}
            <h3>
              Outgoing{' '}
              {user.friendRequests.outgoing.length > 0 &&
                `(${user.friendRequests.outgoing.length})`}
            </h3>
            {user.friendRequests.outgoing.length === 0 ? (
              <p className='no-friend-requests-label'>
                You have no outgoing friend requests.
              </p>
            ) : (
              <div className='friend-request-cards-container'>
                {user.friendRequests.outgoing.map((userId, index) => (
                  <UserCard
                    key={index}
                    userId={userId}
                    type='outgoing friend request'
                  />
                ))}
              </div>
            )}
            <form onSubmit={(e) => handleSubmit(e)}>
              <input
                type='username'
                name='friend-username-input'
                id='friend-username-input'
                placeholder='Enter a username to send a friend request'
                required={true}
                value={friendUsername}
                onChange={(e) => {
                  setFriendUsername(e.target.value);
                }}
              />
              <input
                type='image'
                src='https://s3.amazonaws.com/chat.js/icons/send.png'
                style={{}}
              />
            </form>
          </>
        )}
      </div>
    </>
  );
}
