const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
require('dotenv').config();
const fs = require('fs');
const { mongoose } = require('./api/controller/mongoose');
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:9099",
    methods: ["GET", "POST"]
  }
});
const bodyParser = require('body-parser');
const { List, Task, User } = require('./api/models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const port = process.env.port || 8088;
const host = process.env.host || 'localhost';

const uploadDir = path.join(__dirname, 'uploads');
// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
  res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
  next();
});

// Auth middlewares
let authenticate = (req, res, next) => {
  let token = req.header('x-access-token');
  jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
    if (err) return res.status(401).send(err);
    req.user_id = decoded._id;
    next();
  });
};

let verifySession = (req, res, next) => {
  let refreshToken = req.header('x-refresh-token');
  let _id = req.header('_id');
  User.findByIdAndToken(_id, refreshToken).then((user) => {
    if (!user) return Promise.reject({ error: 'User not found.' });
    req.user_id = user._id;
    req.userObject = user;
    req.refreshToken = refreshToken;
    let isSessionValid = user.sessions.some((session) =>
      session.token === refreshToken && !User.hasRefreshTokenExpired(session.expiresAt)
    );
    if (isSessionValid) next();
    else return Promise.reject({ error: 'Refresh token expired' });
  }).catch((e) => res.status(401).send(e));
};

// List & Task Routes (same as before) ...

// User Registration with Image Upload
app.post('/users', upload.single('profilePic'), (req, res) => {
  let body = req.body;
  if (req.file) {
    body.profilePic = `http://${host}:${port}/uploads/${req.file.filename}`;
  }

  let newUser = new User(body);
  newUser.save().then(() => {
    return newUser.createSession();
  }).then((refreshToken) => {
    return newUser.generateAccessAuthToken().then((accessToken) => {
      return { accessToken, refreshToken };
    });
  }).then((authTokens) => {
    res
      .header('x-refresh-token', authTokens.refreshToken)
      .header('x-access-token', authTokens.accessToken)
      .send(newUser);
  }).catch((e) => res.status(400).send(e));
});

// User Login
app.post('/users/login', (req, res) => {
  let { email, password } = req.body;
  User.findByCredentials(email, password).then((user) => {
    return user.createSession().then((refreshToken) => {
      return user.generateAccessAuthToken().then((accessToken) => {
        return { accessToken, refreshToken };
      });
    }).then((authTokens) => {
      res
        .header('x-refresh-token', authTokens.refreshToken)
        .header('x-access-token', authTokens.accessToken)
        .send(user);
    });
  }).catch((e) => res.status(400).send(e));
});

// Refresh Access Token
app.get('/users/me/access-token', verifySession, (req, res) => {
  req.userObject.generateAccessAuthToken().then((accessToken) => {
    res.header('x-access-token', accessToken).send({ accessToken });
  }).catch((e) => res.status(400).send(e));
});

// Get all users
app.get('/users', authenticate, (req, res) => {
  User.find().then((users) => res.send(users)).catch((e) => res.send(e));
});

app.get('/users/:userId', authenticate, (req, res) => {
  User.findById(req.params.userId).then((user) => res.send(user)).catch((e) => res.send(e));
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('message', (msg) => io.emit('message', msg));
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Start Server
server.listen(port, () => {
  console.clear();
  drawBoxWithText(70, 7, `Node Mongo BE`);
  console.log(`Server is listening on port ${port}`);
});

function drawBoxWithText(width, height, text) {
  const topBottom = '+' + '-'.repeat(width - 2) + '+';
  const emptyLine = '|' + ' '.repeat(width - 2) + '|';
  const textLineIndex = Math.floor((height - 2) / 2);
  const textPadding = Math.max(0, Math.floor((width - 2 - text.length) / 2));
  const textLine = '|' +
    ' '.repeat(textPadding) +
    text +
    ' '.repeat(width - 2 - text.length - textPadding) +
    '|';

  console.log(topBottom);
  for (let i = 0; i < height - 2; i++) {
    console.log(i === textLineIndex ? textLine : emptyLine);
  }
  console.log(topBottom);
}
