import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000', { transports: ['websocket'] });
// const [text, setText] = useState('');
// const [counter, setCounter] = useState(0);
// const [isConnected, setIsConnected] = useState(true);

// useEffect(() => {
//   // Request initial state from server
//   socket.emit('request-text');
//   socket.emit('request-counter');

//   // Set up event listeners
//   socket.on('text', (newText) => {
//     setText(newText);
//   });

//   socket.on('counter', (newCounter) => {
//     setCounter(newCounter);
//   });

//   // Notify the user if they are offline
//   socket.on('connect', () => {
//     setIsConnected(true);
//   });

//   socket.on('disconnect', () => {
//     setIsConnected(false);
//   });

//   // Clean up event listeners
//   return () => {
//     socket.off('text');
//     socket.off('counter');
//     socket.off('disconnect');
//   };
// }, []);

// const handleInput = (event) => {
//   const newText = event.target.value;
//   setText(newText);
//   socket.emit('text-update', newText);
// };

// const handleIncrement = () => {
//   const newCounter = counter + 1;
//   setCounter(newCounter);
//   socket.emit('counter-update', newCounter);
// };

// const handleDecrement = () => {
//   const newCounter = counter - 1;
//   setCounter(newCounter);
//   socket.emit('counter-update', newCounter);
// };

// <div>
//   <textarea value={text} onChange={handleInput} />
//   <p>{counter}</p>
//   <button onClick={handleIncrement}>+</button>
//   <button onClick={handleDecrement}>-</button>
//   {!isConnected && <p style={{ color: 'red' }}>You are offline</p>}
// </div>

// const socket = io.connect('http://localhost:3000', {
//   transports: ['websocket'],
// });

export default function Room() {
  // const { roomName } = useParams();
  // const [newMessage, setNewMessage] = useState('');
  // const [messages, setMessages] = useState([]);
  // const shouldSetup = useRef(true);

  // useEffect(() => {
  //   function setup() {
  //     // Join the room
  //     socket.emit('join room', roomName);

  //     // Request initial state from server
  //     socket.emit('get messages', roomName);

  //     // Set up event listeners
  //     socket.on('messages', (messageList) => {
  //       setMessages(messageList);
  //     });
  //     socket.on('message', (newMessage) => {
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     });
  //   }
  //   if (shouldSetup.current) {
  //     setup();
  //     shouldSetup.current = false;
  //   }
  // }, []);

  return (
    <div>
      {/* <h1>Room: {roomName}</h1>
      <br />

      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>

      <div>
        <input
          type='text'
          id='message'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={() => {
            if (newMessage === '') {
              alert('You must enter a message to send!');
              return;
            }
            socket.emit('message', newMessage, roomName);
            setNewMessage('');
          }}
        >
          Send
        </button>
      </div> */}
    </div>
  );
}
