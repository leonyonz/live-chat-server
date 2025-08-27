const express = require('express');
const roomService = require('../services/roomService');

const router = express.Router();

// Middleware to extract user from token (simplified for now)
// In a real implementation, you would verify the JWT token
const authenticateUser = (req, res, next) => {
  // For demonstration purposes, we'll use a header
  // In practice, you would decode the JWT token
  const userId = req.headers['user-id'];
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  req.userId = userId;
  next();
};

// Create a new room
router.post('/', authenticateUser, async (req, res) => {
  try {
    const roomData = req.body;
    
    // Validate required fields
    if (!roomData.name || roomData.name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Room name is required'
      });
    }
    
    const room = await roomService.createRoom(roomData, req.userId);
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error creating room:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get all public rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await roomService.getPublicRooms();
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Get room by ID
router.get('/:id', async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error fetching room:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch room'
    });
  }
});

// Update room
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body, req.userId);
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Error updating room:', error.message);
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('Room not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Delete room (soft delete)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const room = await roomService.deleteRoom(req.params.id, req.userId);
    res.json({
      success: true,
      data: room,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error.message);
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('Room not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Add user to room
router.post('/:id/join', authenticateUser, async (req, res) => {
  try {
    const room = await roomService.addUserToRoom(req.params.id, req.userId);
    res.json({
      success: true,
      data: room,
      message: 'Joined room successfully'
    });
  } catch (error) {
    console.error('Error joining room:', error.message);
    if (error.message.includes('Room not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Remove user from room
router.post('/:id/leave', authenticateUser, async (req, res) => {
  try {
    const room = await roomService.removeUserFromRoom(req.params.id, req.userId);
    res.json({
      success: true,
      data: room,
      message: 'Left room successfully'
    });
  } catch (error) {
    console.error('Error leaving room:', error.message);
    if (error.message.includes('Room not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
