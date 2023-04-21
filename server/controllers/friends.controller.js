import User from '../models/user.model.js';

import createError from 'http-errors';
import _ from 'lodash';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function sendFriendRequest(req, res, next) {
  const { friendUsername } = req.body;
  if (!friendUsername) {
    return next(createError(400, 'Request body is missing friendUsername.'));
  }
  // Check if friend exists and if user is already friends with them
  // or has sent a friend request
  let friend = await User.findOne({ username: friendUsername }).exec();
  if (!friend) {
    return next(createError(404, 'User not found.'));
  }
  // Prevent user from sending themselves a friend request
  if (friend._id.equals(req.authenticatedUser._id)) {
    return next(createError(400, 'Cannot send friend request to yourself.'));
  }
  if (friend.friends.includes(req.authenticatedUser._id)) {
    return next(createError(400, 'User is already a friend.'));
  }
  if (
    friend.friendRequests.incoming.includes(req.authenticatedUser._id) ||
    friend.friendRequests.outgoing.includes(req.authenticatedUser._id)
  ) {
    return next(createError(400, 'User has already sent a friend request.'));
  }
  friend.friendRequests.incoming.push(req.authenticatedUser._id);

  // Add friend request to user's outgoing friend requests
  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.friendRequests.outgoing.push(friend._id);

  await friend.save();
  await user.save();

  res.status(200).json(_.omit(user.toObject(), ['password']));
}

/**
 *
 * @param {*} req Request body must contain otherId
 * @param {*} res Returns updated user object
 * @param {*} next
 *
 * @returns
 */
async function acceptFriendRequest(req, res, next) {
  const { otherId } = req.body;
  if (!otherId) {
    return next(createError(400, 'Request body is missing otherId.'));
  }

  let other = await User.findOne({ _id: otherId }).exec();
  if (!other) {
    return next(createError(404, 'User not found.'));
  }
  // Prevent user from accepting friend request from themselves
  if (other._id.equals(req.authenticatedUser._id)) {
    return next(
      createError(400, 'Cannot accept friend request from yourself.')
    );
  }

  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (user.friends.includes(otherId)) {
    return next(createError(400, 'User is already a friend.'));
  }

  // Check if other user has sent a friend request and user has the request.
  if (
    !(
      other.friendRequests.outgoing.includes(req.authenticatedUser._id) &&
      user.friendRequests.incoming.includes(otherId)
    )
  ) {
    return next(createError(400, 'User has not sent a friend request.'));
  }

  // Add friend to user's friends list
  user.friends.push(otherId);
  // Remove friend request from user's incoming friend requests
  user.friendRequests.incoming = user.friendRequests.incoming.filter(
    (id) => !id.equals(otherId)
  );
  // Remove friend request from friend's outgoing friend requests
  other.friendRequests.outgoing = other.friendRequests.outgoing.filter(
    (id) => !id.equals(req.authenticatedUser._id)
  );
  // Add user to friend's friends list
  other.friends.push(req.authenticatedUser._id);

  await other.save();
  await user.save();

  res.status(200).json(_.omit(user.toObject(), ['password']));
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function declineFriendRequest(req, res, next) {
  const { otherId } = req.body;
  if (!otherId) {
    return next(createError(400, 'Request body is missing otherId.'));
  }

  let other = await User.findOne({ _id: otherId }).exec();
  if (!other) {
    return next(createError(404, 'User not found.'));
  }
  // Prevent user from declining friend request from themselves
  if (other._id.equals(req.authenticatedUser._id)) {
    return next(
      createError(400, 'Cannot decline friend request from yourself.')
    );
  }

  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }

  // Check if friend has sent a friend request and user has received it
  if (
    !(
      other.friendRequests.outgoing.includes(req.authenticatedUser._id) &&
      user.friendRequests.incoming.includes(otherId)
    )
  ) {
    return next(createError(400, 'User has not sent a friend request.'));
  }

  // Remove friend request from user's incoming friend requests
  user.friendRequests.incoming = user.friendRequests.incoming.filter(
    (id) => !id.equals(otherId)
  );
  // Remove friend request from other user's outgoing friend requests
  other.friendRequests.outgoing = other.friendRequests.outgoing.filter(
    (id) => !id.equals(req.authenticatedUser._id)
  );

  await other.save();
  await user.save();

  res.status(200).json(_.omit(user.toObject(), ['password']));
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function cancelFriendRequest(req, res, next) {
  const { otherId } = req.body;
  if (!otherId) {
    return next(createError(400, 'Request body is missing otherId.'));
  }

  let other = await User.findOne({ _id: otherId }).exec();
  if (!other) {
    return next(createError(404, 'User not found.'));
  }
  // Prevent user from cancelling friend request to themselves
  if (other._id.equals(req.authenticatedUser._id)) {
    return next(createError(400, 'Cannot cancel friend request to yourself.'));
  }

  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }

  // Check if user has sent a friend request and friend has received it
  if (
    !(
      user.friendRequests.outgoing.includes(otherId) &&
      other.friendRequests.incoming.includes(req.authenticatedUser._id)
    )
  ) {
    return next(createError(400, 'User has not sent a friend request.'));
  }

  // Remove friend request from user's outgoing friend requests
  user.friendRequests.outgoing = user.friendRequests.outgoing.filter(
    (id) => !id.equals(otherId)
  );
  // Remove friend request from other user's incoming friend requests
  other.friendRequests.incoming = other.friendRequests.incoming.filter(
    (id) => !id.equals(req.authenticatedUser._id)
  );

  await other.save();
  await user.save();

  res.status(200).json(_.omit(user.toObject(), ['password']));
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function removeFriend(req, res, next) {
  const { friendId } = req.body;
  if (!friendId) {
    return next(createError(400, 'Request body is missing friendId.'));
  }

  let friend = await User.findOne({ _id: friendId }).exec();
  if (!friend) {
    return next(createError(404, 'User not found.'));
  }
  // Prevent user from removing themselves as a friend
  if (friend._id.equals(req.authenticatedUser._id)) {
    return next(createError(400, 'Cannot remove yourself as a friend.'));
  }

  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  if (!user.friends.includes(friendId)) {
    return next(createError(400, 'User is not a friend.'));
  }

  // Remove friend from user's friends list
  user.friends = user.friends.filter((id) => !id.equals(friendId));
  // Remove user from friend's friends list
  friend.friends = friend.friends.filter(
    (id) => !id.equals(req.authenticatedUser._id)
  );

  await friend.save();
  await user.save();

  res.status(200).json(_.omit(user.toObject(), ['password']));
}

export default {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  cancelFriendRequest,
  removeFriend,
};
