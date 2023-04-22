import User from '../models/user.model.js';

import config from '../utils/env.js';
import transporter from '../utils/mail.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default {
  verifyEmail: async function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!(authHeader && authHeader.startsWith('Bearer '))) {
      return next(
        createError(401, 'Request headers are missing authorization.')
      );
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.gmail.secret, async function (err, decoded) {
      if (err) {
        return next(createError(403, 'Failed to verify token.'));
      }
      const user = await User.findOne({ _id: decoded._id }).exec();
      if (!user) {
        return next(createError(404, 'User not found.'));
      }
      user.verified = true;
      await user.save();
    });

    return res.status(200).json('Email verified.');
  },

  sendResetPasswordEmail: async function (req, res, next) {
    const { email } = req.body;
    if (!email) {
      return next(createError(400, 'Request body is missing email.'));
    }

    const user = await User.findOne({ email: email }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    if (!user.verified) {
      return next(createError(403, 'Email not verified.'));
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
        const url = `${protocol}://${base}/reset-password?token=${token}`;
        transporter.sendMail(
          {
            to: email,
            subject: 'Reset your Chat.js password',
            html: `Please <a href="${url}">click here</a> to reset your password. 
          If you didn't request this, please ignore this email.`,
          },
          function (err, info) {
            if (err) {
              return next(createError(500, err));
            }
            res.status(200).json({ message: `Reset password email sent.` });
          }
        );
      }
    );
  },

  resetPassword: async function (req, res, next) {
    const { password } = req.body;
    if (!password) {
      return next(createError(400, 'Request body is missing password.'));
    }

    const authHeader = req.headers.authorization;
    if (!(authHeader && authHeader.startsWith('Bearer '))) {
      return next(
        createError(401, 'Request headers are missing authorization.')
      );
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, config.gmail.secret, async function (err, decoded) {
      if (err) {
        return next(createError(403, 'Failed to verify token.'));
      }
      let user = await User.findOne({ _id: decoded._id }).exec();
      if (!user) {
        return next(createError(404, 'User not found.'));
      }
      if (!user.verified) {
        return next(createError(403, 'Email not verified.'));
      }
      user.password = password;
      await user.save();
    });

    return res.status(200).json('Password reset.');
  },

  signIn: async function (req, res, next) {
    const { username, password } = req.body;
    if (!(username && password)) {
      return next(
        createError(400, 'Request body is missing username or password.')
      );
    }

    let user = await User.findOne({ username: username }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    if (!user.verified) {
      return next(createError(403, 'Email not verified.'));
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return next(createError(401, 'Incorrect password.'));
    }

    jwt.sign(
      { _id: user._id },
      config.server.secret,
      { expiresIn: '1d' },
      async function (err, token) {
        if (err) {
          return next(createError(500, err));
        }
        user.status = 'online';
        await user.save();
        return res
          .status(200)
          .cookie('Chat.js', token, { httpOnly: true })
          .json({ userId: user._id });
      }
    );
  },

  signOut: async function (req, res, next) {
    let user = await User.findOne({ _id: req.authenticatedUser._id }).exec();
    if (!user) {
      return next(createError(404, 'User not found.'));
    }
    user.status = 'offline';
    await user.save();
    return res.status(200).clearCookie('Chat.js').json('Signed out.');
  },
};
