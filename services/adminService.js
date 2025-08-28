const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');

class AdminService {
  // Get all users
  async getAllUsers(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      // Build search query
      const query = search ? {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      } : {};
      
      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await User.countDocuments(query);
      
      return {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
      ).select('-password');
      
      return user;
    } catch (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      // First delete all messages by this user
      await Message.deleteMany({ userId });
      
      // Then remove user from all rooms
      await Room.updateMany(
        { members: userId },
        { $pull: { members: userId } }
      );
      
      // Finally delete the user
      const user = await User.findByIdAndDelete(userId);
      return user;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get all rooms
  async getAllRooms(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      // Build search query
      const query = search ? {
        name: { $regex: search, $options: 'i' }
      } : {};
      
      const rooms = await Room.find(query)
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Room.countDocuments(query);
      
      return {
        rooms,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalRooms: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch rooms: ${error.message}`);
    }
  }

  // Delete room
  async deleteRoom(roomId) {
    try {
      // First delete all messages in this room
      await Message.deleteMany({ roomId });
      
      // Then delete the room
      const room = await Room.findByIdAndDelete(roomId);
      return room;
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  // Get all messages
  async getAllMessages(page = 1, limit = 10, search = '') {
    try {
      const skip = (page - 1) * limit;
      
      // Build search query
      const query = search ? {
        $or: [
          { content: { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } }
        ]
      } : {};
      
      const messages = await Message.find(query)
        .populate('userId', 'username')
        .populate('roomId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      const total = await Message.countDocuments(query);
      
      return {
        messages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalMessages: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      const message = await Message.findByIdAndDelete(messageId);
      return message;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Get analytics data
  async getAnalytics() {
    try {
      const totalUsers = await User.countDocuments();
      const totalRooms = await Room.countDocuments();
      const totalMessages = await Message.countDocuments();
      
      // Get recent users
      const recentUsers = await User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(5);
      
      // Get recent rooms
      const recentRooms = await Room.find()
        .populate('createdBy', 'username')
        .sort({ createdAt: -1 })
        .limit(5);
      
      // Get recent messages
      const recentMessages = await Message.find()
        .populate('userId', 'username')
        .populate('roomId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);
      
      return {
        stats: {
          totalUsers,
          totalRooms,
          totalMessages
        },
        recentUsers,
        recentRooms,
        recentMessages
      };
    } catch (error) {
      throw new Error(`Failed to fetch analytics: ${error.message}`);
    }
  }
}

module.exports = new AdminService();
