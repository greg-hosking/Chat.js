import User from '../models/user.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getUserBioById(req, res, next) {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  res
    .status(200)
    .json(
      _.pick(user.toObject(), [
        '_id',
        'username',
        'usernameColor',
        'portrait',
        'status',
      ])
    );
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getAuthenticatedUser(req, res, next) {
  const { _id } = req.authenticatedUser;
  const user = await User.findOne({ _id: _id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  res.status(200).json(_.omit(user.toObject(), ['password']));
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function createUser(req, res, next) {
  const { username, email, password } = req.body;
  if (!(username && email && password)) {
    return next(
      createError(400, 'Request body is missing username, email, or password.')
    );
  }

  const user = new User({
    username: username,
    email: email,
    password: password,
  });

  try {
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return next(
        createError(409, 'User already exists with that username or email.')
      );
    }
    return next(createError(500, error));
  }

  jwt.sign(
    { _id: user._id },
    config.gmail.secret,
    { expiresIn: '1d' },
    function (err, token) {
      if (err) {
        return next(createError(500, err));
      }
      const protocol = req.protocol;
      const base = req.headers.host;
      const url = `${protocol}://${base}/verification?token=${token}`;
      transporter.sendMail(
        {
          to: email,
          subject: 'Verify your Chat.js account',
          html: `Please <a href="${url}">click here</a> to verify your email.`,
        },
        async function (err, info) {
          if (err) {
            return next(createError(500, err));
          }
          res.status(200).json(`Verification email sent.`);
        }
      );
    }
  );
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function updateUserPortrait(req, res, next) {
  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.portrait = req.file.location;
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
async function updateUsernameColor(req, res, next) {
  const { usernameColor } = req.body;
  if (!usernameColor) {
    return next(createError(400, 'Request body is missing color.'));
  }
  // Verify color is valid hex code
  if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(usernameColor)) {
    return next(createError(400, 'Color is not a valid hex code.'));
  }
  let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
  if (!user) {
    return next(createError(404, 'User not found.'));
  }
  user.usernameColor = usernameColor;
  await user.save();
  res.status(200).json(_.omit(user.toObject(), ['password']));
}

export default {
  getUserBioById,
  getAuthenticatedUser,
  createUser,
  updateUserPortrait,
  updateUsernameColor,
};
