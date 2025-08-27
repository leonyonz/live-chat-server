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
const path = require('path');
require('dotenv').config();

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

// Authentication routes
app.use('/api/auth', authRoutes);

// Giphy routes
app.use('/api/giphy', giphyRoutes);

// Room routes
app.use('/api/rooms', roomRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a chat room
  socket.on('join-room', (roomName, userName) => {
    socket.join(roomName);
    // Notify others in the room that a user has joined
    socket.to(roomName).emit('user-joined', userName);
  });

  // Handle incoming messages
  socket.on('send-message', (data) => {
    const { roomName, message, userName, userId } = data;
    // Broadcast message to everyone in the room
    io.to(roomName).emit('receive-message', {
      message,
      userName,
      userId,
      timestamp: new Date()
    });
  });

  // Handle GIF messages
  socket.on('send-gif', (data) => {
    const { roomName, gifUrl, userName, userId } = data;
    // Broadcast GIF to everyone in the room
    io.to(roomName).emit('receive-gif', {
      gifUrl,
      userName,
      userId,
      timestamp: new Date()
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
