# Chat.js

Chat.js is a simple chat application built with React, Express, Socket.io, and MongoDB. It allows users to join chat rooms and exchange messages with other users in real-time.

## Getting started

To get started with Chat.js, follow these steps:

1. Clone this repository:

   ```
   git clone https://github.com/greg-hosking/chat.js.git
   ```

2. Install front end dependencies:

   ```
   cd /client
   npm install
   ```

3. Install back end dependencies: 

   ```
   cd /server
   npm install
   ```

4. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file and set the values for the environment variables.

5. Start the development server (front end):

   ```
   cd /client
   npm run dev
   ```

6. Start the development server (back end):

   ```
   cd /server
   npm run dev
   ```

7. Open your browser and go to `http://localhost:3000`. You should see the Chat.js application running.

## Live deployment

Coming soon!

## Features

- User authentication: users can create accounts, sign in, and sign out.
- Friends: users can friend other users and chat in a private chat room.
- Chat rooms: users can create, join, and leave chat rooms.
- Real-time messaging: users can send and receive messages in real-time using Socket.io.
- History: users can view the messages sent in a chat room even if they were not online when the messages were sent.
- MongoDB integration: messages and chat room data are stored in a MongoDB database.

## Technologies used

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [AWS S3](https://aws.amazon.com/s3/)
- [Multer](https://github.com/expressjs/multer)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
