const jwt = require('jsonwebtoken');
const { User } = require('../models');

authenticate = (req, res, next) => {
  const token = req.header('x-access-token');
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) return res.status(401).send(err);
    req.user_id = decoded._id;
    next();
  });
};

verifySession = (req, res, next) => {
  const refreshToken = req.header('x-refresh-token');
  const _id = req.header('_id');

  User.findByIdAndToken(_id, refreshToken)
    .then((user) => {
      if (!user) return Promise.reject({ error: 'User not found.' });

      const isSessionValid = user.sessions.some(
        (session) => session.token === refreshToken &&
          !User.hasRefreshTokenExpired(session.expiresAt)
      );

      if (isSessionValid) {
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;
        next();
      } else {
        return Promise.reject({ error: 'Refresh token expired' });
      }
    })
    .catch((e) => res.status(401).send(e));
};

module.exports = {
  authenticate,
  verifySession
}
