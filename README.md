# Chat.js

Chat.js is a simple chat application built with React, Express, Socket.io, and MongoDB. It allows users to join chat rooms and exchange messages with other users in real-time.

## Getting started

To get started with Chat.js, follow these steps:

1. Clone this repository:

   ```
   git clone https://github.com/greg-hosking/chat.js.git
   ```

2. Install dependencies:

   ```
   npm install
   ```


3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file and set the values for the environment variables.

4. Start the application in development mode:

   ```
   npm run dev
   ```

5. Your browser should automatically bring you to `http://localhost:3000`, where you should see the Chat.js application running.

## Live deployment

Chat.js is currently deployed on Heroku and can be accessed at [https://chatjs.herokuapp.com](https://chatjs.herokuapp.com).

The application is redeployed with every push to the `master` branch. 


## Features

- User authentication: users can create and customize accounts, sign in, and sign out.
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
