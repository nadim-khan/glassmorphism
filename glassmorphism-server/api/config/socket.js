const userSocketMap = new Map(); // userId => socket.id

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('register', (userId) => {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    socket.on('send-private-message', ({ toUserId, message }) => {
      const targetSocket = userSocketMap.get(toUserId);
      if (targetSocket) {
        io.to(targetSocket).emit('private-message', {
          fromUserId: getUserIdBySocket(socket.id),
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

// Helper: get userId from socketId
function getUserIdBySocket(socketId) {
  for (const [userId, sockId] of userSocketMap.entries()) {
    if (sockId === socketId) return userId;
  }
  return null;
}

// Export socket setup function and helper
module.exports = (io) => socketHandler(io);
module.exports.sendMessageToUser = (toUserId, message) => {
  const socketId = userSocketMap.get(toUserId);
  if (socketId) {
    const io = require('socket.io')(http.createServer()); // dummy for context
    io.to(socketId).emit('private-message', { from: 'server', message });
    return true;
  }
  return false;
};
