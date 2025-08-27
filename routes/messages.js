const express = require('express');
const messageService = require('../services/messageService');

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

// Create a new message
router.post('/', authenticateUser, async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      userId: req.userId,
      username: req.body.username // In a real app, this would come from the user object
    };
    
    // Validate required fields
    if (!messageData.roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }
    
    if (!messageData.content || messageData.content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    const message = await messageService.createMessage(messageData);
    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error creating message:', error.message);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get messages for a room
router.get('/room/:roomId', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const messages = await messageService.getMessagesByRoom(
      req.params.roomId, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Get message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await messageService.getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error fetching message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch message'
    });
  }
});

// Update message (edit)
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const message = await messageService.updateMessage(req.params.id, req.body, req.userId);
    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error updating message:', error.message);
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('Message not found')) {
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

// Delete message (soft delete)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const message = await messageService.deleteMessage(req.params.id, req.userId);
    res.json({
      success: true,
      data: message,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error.message);
    if (error.message.includes('Unauthorized')) {
      return res.status(403).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('Message not found')) {
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
