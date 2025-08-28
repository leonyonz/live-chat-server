const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const giphyRoutes = require('./routes/giphy');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const path = require('path');
require('dotenv').config();

// Debug utility
const DEBUG_ENABLED = process.env.DEBUG_ENABLED === 'true';

function debugLog(...args) {
  if (DEBUG_ENABLED) {
    console.log('[Server Debug]', ...args);
  }
}

function debugError(...args) {
  if (DEBUG_ENABLED) {
    console.error('[Server Debug]', ...args);
  }
}

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send('Live Chat Server is running!');
});

// Widget route
app.get('/widget.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'widget.html'));
});

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'admin.html'));
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Giphy routes
app.use('/api/giphy', giphyRoutes);

// Room routes
app.use('/api/rooms', roomRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Import message service
const messageService = require('./services/messageService');
const Room = require('./models/Room');

// Track user connections to handle cross-device sync
const userConnections = new Map(); // Maps userId to array of socket IDs

// Socket.io connection handling
io.on('connection', (socket) => {
  debugLog('User connected:', socket.id);

  // Join a chat room
  socket.on('join-room', async (roomName, userName, userId) => {
    debugLog(`User ${userName} (${userId}) joining room: ${roomName}`);
    socket.join(roomName);
    // Notify others in the room that a user has joined
    socket.to(roomName).emit('user-joined', userName);
    
    // Track user connections for cross-device sync
    if (!userConnections.has(userId)) {
      userConnections.set(userId, []);
    }
    userConnections.get(userId).push(socket.id);
    socket.userId = userId; // Store userId on socket for easy access
    
    // Get room ID for message saving
    try {
      let room = await Room.findOne({ name: roomName });
      if (!room) {
        // Create room if it doesn't exist
        room = new Room({ name: roomName, createdBy: userId, members: [userId] });
        await room.save();
        debugLog(`Created new room: ${roomName} with ID: ${room._id}`);
      } else {
        // Add user to room members if not already a member
        if (!room.members.includes(userId)) {
          room.members.push(userId);
          await room.save();
          debugLog(`Added user ${userId} to existing room: ${roomName}`);
        } else {
          debugLog(`User ${userId} is already a member of room: ${roomName}`);
        }
      }
      // Store room ID in socket for later use
      socket.roomId = room._id;
      debugLog(`Socket ${socket.id} joined room ${roomName} with ID: ${room._id}`);
    } catch (error) {
      debugError('Error getting/creating room:', error);
    }
  });

  // Handle incoming messages
  socket.on('send-message', async (data) => {
    const { roomName, message, userName, userId } = data;
    debugLog(`Received message from ${userName} (${userId}) in room ${roomName}: ${message}`);
    
    let savedMessageId = null;
    
    // Save message to database
    try {
      // Get room ID
      const room = await Room.findOne({ name: roomName });
      if (room) {
        const messageData = {
          roomId: room._id,
          userId: userId,
          username: userName,
          content: message
        };
        
        const savedMessage = await messageService.createMessage(messageData);
        debugLog('Message saved to database:', savedMessage._id);
        savedMessageId = savedMessage._id;
      }
    } catch (error) {
      debugError('Error saving message to database:', error);
    }
    
    // Broadcast message to everyone in the room
    debugLog(`Broadcasting message to room: ${roomName}`);
    const roomSockets = Array.from(io.sockets.adapter.rooms.get(roomName) || []);
    debugLog(`Sockets in room ${roomName}:`, roomSockets);
    io.to(roomName).emit('receive-message', {
      message,
      userName,
      userId,
      _id: savedMessageId,
      timestamp: new Date()
    });
    debugLog(`Message broadcast complete for room: ${roomName}`);
  });

  // Handle GIF messages
  socket.on('send-gif', async (data) => {
    const { roomName, gifUrl, userName, userId } = data;
    debugLog(`Received GIF from ${userName} (${userId}) in room ${roomName}: ${gifUrl}`);
    
    let savedMessageId = null;
    
    // Save GIF message to database
    try {
      // Get room ID
      const room = await Room.findOne({ name: roomName });
      if (room) {
        const messageData = {
          roomId: room._id,
          userId: userId,
          username: userName,
          content: 'GIF message',
          messageType: 'gif',
          gifUrl: gifUrl
        };
        
        const savedMessage = await messageService.createMessage(messageData);
        debugLog('GIF message saved to database:', savedMessage._id);
        savedMessageId = savedMessage._id;
      }
    } catch (error) {
      debugError('Error saving GIF message to database:', error);
    }
    
    // Broadcast GIF to everyone in the room
    debugLog(`Broadcasting GIF to room: ${roomName}`);
    const roomSockets = Array.from(io.sockets.adapter.rooms.get(roomName) || []);
    debugLog(`Sockets in room ${roomName}:`, roomSockets);
    io.to(roomName).emit('receive-gif', {
      gifUrl,
      userName,
      userId,
      _id: savedMessageId,
      timestamp: new Date()
    });
    debugLog(`GIF broadcast complete for room: ${roomName}`);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    debugLog('User disconnected:', socket.id);
    
    // Clean up user connections tracking
    if (socket.userId) {
      const connections = userConnections.get(socket.userId);
      if (connections) {
        const index = connections.indexOf(socket.id);
        if (index > -1) {
          connections.splice(index, 1);
        }
        // If no more connections for this user, remove the entry
        if (connections.length === 0) {
          userConnections.delete(socket.userId);
        }
      }
    }
  });
});

// Helper function to emit to all connections of a user
function emitToUser(userId, event, data) {
  const connections = userConnections.get(userId);
  if (connections) {
    connections.forEach(socketId => {
      io.to(socketId).emit(event, data);
    });
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  debugLog(`Server is running on port ${PORT}`);
});
