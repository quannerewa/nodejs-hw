import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return next(createHttpError(401));
    }

    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      return next(createHttpError(401));
    }

    const isExpired = new Date() > new Date(session.accessTokenValidUntil);

    if (isExpired) {
      return next(createHttpError(401));
    }

    const user = await User.findById(session.userId);

    if (!user) {
      return next(createHttpError(401));
    }

    req.user = user;
    next();

  } catch (error) {
  next(createHttpError(500, error.message));
}

};
