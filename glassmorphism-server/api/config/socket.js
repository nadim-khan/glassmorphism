const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const http = require('http');

// === CONFIGURATION === //
const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes for AES-256
const logFilePath = path.join(__dirname, 'messages.enc');

// === USER SOCKET MAP === //
const userSocketMap = new Map(); // userId => socket.id

// === ENCRYPTION UTILS === //
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(encrypted) {
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// === MESSAGE STORAGE === //
function saveMessageToFile(messageObj) {
  const plainText = JSON.stringify(messageObj);
  const encryptedText = encrypt(plainText);
  fs.appendFileSync(logFilePath, encryptedText + '\n');
}

function readAllMessages() {
  if (!fs.existsSync(logFilePath)) return [];

  const lines = fs.readFileSync(logFilePath, 'utf8').split('\n').filter(Boolean);
  const messages = [];

  for (const line of lines) {
    try {
      const decrypted = decrypt(line);
      messages.push(JSON.parse(decrypted));
    } catch (err) {
      console.error('Failed to decrypt message:', err.message);
    }
  }

  return messages;
}

// === SOCKET HANDLER === //
function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId) => {
      userSocketMap.set(userId, socket.id);
      socket.userId = userId; // ✅ Store userId on socket
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    socket.on('send-private-message', ({ toUserId, message }) => {
      const fromUserId = socket.userId || getUserIdBySocket(socket.id); // ✅ safer fallback
      const targetSocket = userSocketMap.get(toUserId);

      saveMessageToFile({
        from: fromUserId,
        to: toUserId,
        message,
        timestamp: new Date().toISOString()
      });

      if (targetSocket) {
        io.to(targetSocket).emit('private-message', {
          fromUserId,
          message
        });
      } else {
        console.log(`User ${toUserId} not connected`);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

// === HELPER: Get userId from socketId === //
function getUserIdBySocket(socketId) {
  for (const [userId, sockId] of userSocketMap.entries()) {
    if (sockId === socketId) return userId;
  }
  return null;
}

// === EXPORTS === //
module.exports = (io) => socketHandler(io);

module.exports.sendMessageToUser = (toUserId, message) => {
  const socketId = userSocketMap.get(toUserId);
  if (socketId) {
    const io = require('socket.io')(http.createServer()); // dummy IO for direct emit
    io.to(socketId).emit('private-message', { from: 'server', message });
    return true;
  }
  return false;
};

module.exports.readAllMessages = readAllMessages;
