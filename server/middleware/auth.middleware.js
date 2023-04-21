import config from '../utils/env.js';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';

export default {
  isAuthenticated: async function (req, res, next) {
    const token = req.cookies['Chat.js'];
    if (!token) {
      return next(createError(401, 'Request cookies are missing token.'));
    }

    jwt.verify(token, config.server.secret, function (err, decoded) {
      if (err) {
        return next(createError(403, 'Failed to verify token.'));
      }
      // Once verified, add the authenticated user to the request object so
      // that it can be used in the controller function that is called next.
      req.authenticatedUser = { _id: decoded._id };
      next();
    });
  },

  isRequestedUser: async function (req, res, next) {
    const { _id } = req.authenticatedUser;
    const { userId } = req.params;

    if (userId !== _id) {
      return next(createError(403, 'Unauthorized.'));
    }

    next();
  },
};
