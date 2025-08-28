const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const adminService = require('../services/adminService');

const router = express.Router();

// Apply admin authentication middleware to all routes
router.use(adminAuth);

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await adminService.getAnalytics();
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await adminService.getAllUsers(parseInt(page), parseInt(limit), search);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "admin"'
      });
    }
    
    const user = await adminService.updateUserRole(req.params.id, role);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await adminService.deleteUser(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.json({
      success: true,
      data: user,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await adminService.getAllRooms(parseInt(page), parseInt(limit), search);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching rooms:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms'
    });
  }
});

// Delete room
router.delete('/rooms/:id', async (req, res) => {
  try {
    const room = await adminService.deleteRoom(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    res.json({
      success: true,
      data: room,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting room:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room'
    });
  }
});

// Get all messages
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const result = await adminService.getAllMessages(parseInt(page), parseInt(limit), search);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Delete message
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await adminService.deleteMessage(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    res.json({
      success: true,
      data: message,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

module.exports = router;
