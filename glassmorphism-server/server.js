const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./api/config/config');
require('dotenv').config();

const { mongoose } = require('./api/controller/mongoose');
const userRoutes = require('./api/routes/user.route');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: config.socketOrigin, methods: ["GET", "POST"] }
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use(bodyParser.json());


app.use('/uploads', express.static('uploads'));

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
  res.header("Access-Control-Expose-Headers", "x-access-token, x-refresh-token");
  next();
});

// Routes
app.use('/users', userRoutes);


// Import socket handler
require('./api/config/socket')(io);

// Optional REST endpoint to trigger private message
const { sendMessageToUser } = require('./api/config/socket');

app.post('/send-message', (req, res) => {
  const { toUserId, message } = req.body;
  const success = sendMessageToUser(toUserId, message);
  if (success) return res.send({ success: true });
  else return res.status(404).send({ error: 'User not connected' });
});

server.listen(config.port, () => {
  console.clear();
  console.log(`Server is listening on port ${config.port}`);
});
