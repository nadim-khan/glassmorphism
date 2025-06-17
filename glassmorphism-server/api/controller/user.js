const { User } = require('../models');

registerUser = (req, res) => {
  let body = req.body;
  if (req.file) {
    const host = process.env.host || 'localhost';
    const port = process.env.port || 8088;
    body.profilePic = `http://${host}:${port}/uploads/${req.file.filename}`;
  }

  const newUser = new User(body);
  newUser.save()
    .then(() => newUser.createSession())
    .then((refreshToken) => newUser.generateAccessAuthToken()
      .then((accessToken) => ({ accessToken, refreshToken }))
    )
    .then(({ accessToken, refreshToken }) => {
      res.header('x-refresh-token', refreshToken)
        .header('x-access-token', accessToken)
        .send(newUser);
    })
    .catch((e) => res.status(400).send(e));
};

loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => user.createSession()
      .then((refreshToken) => user.generateAccessAuthToken()
        .then((accessToken) => ({ accessToken, refreshToken }))
      )
      .then(({ accessToken, refreshToken }) => {
        res.header('x-refresh-token', refreshToken)
          .header('x-access-token', accessToken)
          .send(user);
      })
    )
    .catch((e) => res.status(400).send(e));
};

refreshAccessToken = (req, res) => {
  req.userObject.generateAccessAuthToken()
    .then((accessToken) => {
      res.header('x-access-token', accessToken).send({ accessToken });
    })
    .catch((e) => res.status(400).send(e));
};

getAllUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch((e) => res.send(e));
};

getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send(user))
    .catch((e) => res.send(e));
};

updateUser = (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, {
    $set: req.body
  })
    .then((user) => res.send(user))
    .catch((e) => res.send(e));
};

deleteUser = (req, res) => {
  User.deleteOne(req.params.userId)
    .then((user) => res.send(user))
    .catch((e) => res.send(e));
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};


