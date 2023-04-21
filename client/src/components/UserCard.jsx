import React, { useEffect, useState, useRef } from 'react';

export default function UserCard({ userId, type }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const shouldFetch = useRef(true);

  async function handleAcceptFriendRequest(e) {
    e.preventDefault();
    const response = await fetch(`/api/users/me/friendRequests/accept`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otherId: user._id }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    setUser(null);
    window.location.reload();
  }

  async function handleDeclineFriendRequest(e) {
    e.preventDefault();
    const response = await fetch(`/api/users/me/friendRequests/decline`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otherId: user._id }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    setUser(null);
    window.location.reload();
  }

  async function handleCancelFriendRequest(e) {
    e.preventDefault();
    const response = await fetch(`/api/users/me/friendRequests/cancel`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otherId: user._id }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    setUser(null);
    window.location.reload();
  }

  async function handleRemoveFriend(e) {
    e.preventDefault();

    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    const response = await fetch(`/api/users/me/friends`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ friendId: user._id }),
    });
    if (!response.ok) {
      alert(response.status);
      return;
    }
    setUser(null);
    window.location.reload();
  }

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        alert(response.status);
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
      {loading || !user ? (
        <></>
      ) : (
        <div className='user-card'>
          <img
            src={user.portrait}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://s3.amazonaws.com/chat.js/icons/user.png';
            }}
            draggable={false}
            className='user-card-portrait'
            style={{
              border:
                user.status === 'online' ? '2px solid green' : '2px solid gray',
            }}
          />
          <h4 style={{ color: user.usernameColor }}>{user.username}</h4>

          <div className='user-card-buttons'>
            {type === 'incoming friend request' && (
              <>
                <div className='user-card-button'>
                  <img
                    src='https://s3.amazonaws.com/chat.js/icons/checkmark.png'
                    className='accept'
                    onClick={(e) => {
                      handleAcceptFriendRequest(e);
                    }}
                  />
                </div>
                <div className='user-card-button'>
                  <img
                    src='https://s3.amazonaws.com/chat.js/icons/cancel.png'
                    className='decline'
                    onClick={(e) => {
                      handleDeclineFriendRequest(e);
                    }}
                  />
                </div>
              </>
            )}
            {type === 'outgoing friend request' && (
              <div className='user-card-button'>
                <img
                  src='https://s3.amazonaws.com/chat.js/icons/cancel.png'
                  className='decline'
                  onClick={(e) => {
                    handleCancelFriendRequest(e);
                  }}
                />
              </div>
            )}
            {type === 'friend' && (
              <>
                <div className='user-card-button'>
                  <img
                    src='https://s3.amazonaws.com/chat.js/icons/rooms.png'
                    className='message'
                    onClick={(e) => {
                      handleJoinFriendRoom(e, friend._id);
                    }}
                  />
                </div>

                <div className='user-card-button'>
                  <img
                    src='https://s3.amazonaws.com/chat.js/icons/cancel.png'
                    className='decline'
                    onClick={(e) => {
                      handleRemoveFriend(e);
                    }}
                  />
                </div>
              </>
            )}
            {type === 'room member' && <></>}
          </div>
        </div>
      )}
    </>
  );
}
