// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// app.use(cors());

// let text = '';
// let counter = 0;

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Set up a join room event listener
//   socket.on('join room', (room) => {
//     console.log(`User joined room ${room}`);
//     socket.join(room); // Join the specified room
//     io.to(room).emit('message', `User has joined room ${room}`); // Broadcast message to the room
//   });

//   // Set up a leave room event listener
//   socket.on('leave room', (room) => {
//     console.log(`User left room ${room}`);
//     socket.leave(room); // Leave the specified room
//     io.to(room).emit('message', `User has left room ${room}`); // Broadcast message to the room
//   });

//   // Set up a create room event listener
//   socket.on('create room', (roomName) => {
//     console.log(`User created room ${roomName}`);
//     socket.emit('room created', roomName); // Send the room name back to the user
//   });

//   // Set up a get rooms event listener
//   socket.on('get rooms', () => {
//     console.log('User requested rooms');

//     console.log(io.sockets.adapter.rooms);

//     // Get the list of rooms and send to the user
//     socket.emit('rooms', [...io.sockets.adapter.rooms.keys()]);
//   });

//   // socket.on('get messages', (room) => {
//   //   console.log(`User requested messages for room ${room}`);

//   // });

//   // Set up a message event listener
//   socket.on('message', (message, room) => {
//     console.log(`User sent message to room ${room}: ${message}`);
//     io.to(room).emit('message', message); // Broadcast message to the room
//   });

//   // Respond to client request for initial state
//   socket.on('request-text', () => {
//     socket.emit('text', text);
//   });

//   socket.on('request-counter', () => {
//     socket.emit('counter', counter);
//   });

//   // Receive updates from the client and broadcast to all clients
//   socket.on('text-update', (newText) => {
//     text = newText;
//     io.emit('text', text);
//   });

//   // Receive updates from the client and broadcast to all clients
//   socket.on('counter-update', (newCounter) => {
//     counter = newCounter;
//     io.emit('counter', counter);
//   });

//   // Set up a disconnect event listener
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });

// *****************
// Express app setup
// *****************
import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// **************
// Mongoose setup
// **************
import mongoose from 'mongoose';
import config from './utils/env.js';

await mongoose.connect(config.db.uri);

// ****************
// API routes setup
// ****************
import setupRoutes from './routes/router.js';

setupRoutes(app);

// ****************
// Deployment Setup
// ****************
import { fileURLToPath } from 'url';
import path from 'path';

if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Server is running...');
  });
}

// ********************
// Error handling setup
// ********************
import createError from 'http-errors';

app.use((req, res, next) => {
  next(createError(404, req.url + ' not found'));
});

app.use((err, res) => {
  res.status(err.status || 500).send(err.message);
});

// ***************
// Socket.io setup
// ***************
// import http from 'http';
// import { Server } from 'socket.io';

// const server = http.createServer(app);
// const io = new Server(server);

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   // Set up a join room event listener
//   socket.on('join room', (room) => {
//     console.log(`User joined room ${room}`);
//     socket.join(room); // Join the specified room
//     io.to(room).emit('message', `User has joined room ${room}`); // Broadcast message to the room
//   });

//   // Set up a leave room event listener
//   socket.on('leave room', (room) => {
//     console.log(`User left room ${room}`);
//     socket.leave(room); // Leave the specified room
//     io.to(room).emit('message', `User has left room ${room}`); // Broadcast message to the room
//   });

//   // Set up a create room event listener
//   socket.on('create room', (roomName) => {
//     console.log(`User created room ${roomName}`);
//     socket.emit('room created', roomName); // Send the room name back to the user
//   });

//   // Set up a get rooms event listener
//   socket.on('get rooms', () => {
//     console.log('User requested rooms');

//     console.log(io.sockets.adapter.rooms);

//     // Get the list of rooms and send to the user
//     socket.emit('rooms', [...io.sockets.adapter.rooms.keys()]);
//   });

//   // socket.on('get messages', (room) => {
//   //   console.log(`User requested messages for room ${room}`);

//   // });

//   // Set up a message event listener
//   socket.on('message', (message, room) => {
//     console.log(`User sent message to room ${room}: ${message}`);
//     io.to(room).emit('message', message); // Broadcast message to the room
//   });

//   // Set up a disconnect event listener
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

// *******************
// Express app startup
// *******************
const PORT = config.server.port || 3001;

app.listen(PORT);
console.log(`Server listening on port: ${PORT}`);
