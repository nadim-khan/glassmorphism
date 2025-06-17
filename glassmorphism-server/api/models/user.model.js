const mongoose = require('mongoose');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

/**
 * Session Schema for refresh tokens
 */
const SessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Number, required: true }
});

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  country: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  city: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  },
  address: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    default: 'user'
  },
  profilePic: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sessions: [SessionSchema]
});

/**
 * Remove sensitive info from user object
 */
UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  return _.omit(user, ['password', 'sessions']);
};

/**
 * Generate Access Token (15 mins)
 */
UserSchema.methods.generateAccessAuthToken = function () {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { _id: this._id.toHexString() },
      jwtSecret,
      { expiresIn: "15m" },
      (err, token) => err ? reject(err) : resolve(token)
    );
  });
};

/**
 * Generate Refresh Token (64-byte hex string)
 */
UserSchema.methods.generateRefreshAuthToken = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      return err ? reject(err) : resolve(buf.toString('hex'));
    });
  });
};

/**
 * Create new session with refresh token
 */
UserSchema.methods.createSession = function () {
  const user = this;
  return user.generateRefreshAuthToken()
    .then(refreshToken => saveSessionToDatabase(user, refreshToken))
    .catch(err => Promise.reject('Failed to save session.\n' + err));
};

/**
 * Static: Get JWT secret
 */
UserSchema.statics.getJWTSecret = () => jwtSecret;

/**
 * Static: Find user by ID and refresh token
 */
UserSchema.statics.findByIdAndToken = function (_id, token) {
  return this.findOne({ _id, 'sessions.token': token });
};

/**
 * Static: Validate credentials
 */
UserSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email }).then((user) => {
    if (!user) return Promise.reject("Invalid email or password");

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        return res ? resolve(user) : reject("Invalid email or password");
      });
    });
  });
};

/**
 * Static: Check if refresh token expired
 */
UserSchema.statics.hasRefreshTokenExpired = function (expiresAt) {
  return Date.now() / 1000 > expiresAt;
};

/**
 * Mongoose Pre-save Hook to hash password
 */
UserSchema.pre('save', function (next) {
  const user = this;
  const costFactor = 10;

  if (user.isModified('password')) {
    bcrypt.genSalt(costFactor, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

/**
 * Helper: Save session to DB with expiry
 */
function saveSessionToDatabase(user, refreshToken) {
  const expiresAt = generateRefreshTokenExpiryTime();
  user.sessions.push({ token: refreshToken, expiresAt });

  return user.save().then(() => refreshToken);
}

/**
 * Helper: Generate refresh token expiry timestamp
 */
function generateRefreshTokenExpiryTime() {
  const daysUntilExpire = 10;
  const seconds = daysUntilExpire * 24 * 60 * 60;
  return Math.floor(Date.now() / 1000) + seconds;
}

const User = mongoose.model('User', UserSchema);
module.exports = { User };
