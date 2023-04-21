import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io.connect('http://localhost:3001', {
//   transports: ['websocket'],
// });

export default function Rooms() {
  // const [rooms, setRooms] = useState([]);
  // const [newRoomName, setNewRoomName] = useState('');
  // const shouldSetup = useRef(true);

  // useEffect(() => {
  //   function setup() {
  //     // Request initial state from server
  //     socket.emit('get rooms');

  //     // Set up event listeners
  //     socket.on('rooms', (roomList) => {
  //       setRooms(roomList);
  //     });
  //     socket.on('room created', (roomName) => {
  //       window.location = `/rooms/${roomName}`;
  //     });

  //     // Clean up event listeners
  //     return () => {
  //       socket.off('rooms');
  //       socket.off('room created');
  //     };
  //   }

  //   if (shouldSetup.current) {
  //     setup();
  //     shouldSetup.current = false;
  //   }
  // }, []);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const shouldFetch = useRef(true);

  const navigate = useNavigate();

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
  }, []);

  return (
    <>
      <div className='content-container content-container-lg'>
        <h2>My Rooms</h2>
      </div>
      <div className='content-container content-container-lg'>
        <h2>Public Rooms</h2>
      </div>
    </>
  );
}
