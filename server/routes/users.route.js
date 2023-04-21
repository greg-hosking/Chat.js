import express from 'express';

import friendsController from '../controllers/friends.controller.js';
import usersController from '../controllers/users.controller.js';

import auth from '../middleware/auth.middleware.js';

import upload from '../utils/upload.js';

const router = express.Router();

router.post('/', usersController.createUser);

router.get('/me', auth.isAuthenticated, usersController.getAuthenticatedUser);

router.put(
  '/me/portrait',
  auth.isAuthenticated,
  upload.single('image'),
  usersController.updateUserPortrait
);

router.put(
  '/me/usernameColor',
  auth.isAuthenticated,
  usersController.updateUsernameColor
);

router.post(
  '/me/friendRequests',
  auth.isAuthenticated,
  friendsController.sendFriendRequest
);

router.post(
  '/me/friendRequests/accept',
  auth.isAuthenticated,
  friendsController.acceptFriendRequest
);

router.post(
  '/me/friendRequests/decline',
  auth.isAuthenticated,
  friendsController.declineFriendRequest
);

router.post(
  '/me/friendRequests/cancel',
  auth.isAuthenticated,
  friendsController.cancelFriendRequest
);

router.delete(
  '/me/friends',
  auth.isAuthenticated,
  friendsController.removeFriend
);

router.get('/:userId', auth.isAuthenticated, usersController.getUserBioById);

// router.post(
//   '/me/friends/block',
//   auth.isAuthenticated,
//   usersController.blockFriend
// );

// router.post(
//   '/me/friends/unblock',
//   auth.isAuthenticated,
//   usersController.unblockFriend
// );

export default router;
