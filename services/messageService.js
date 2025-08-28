const Message = require('../models/Message');
const Room = require('../models/Room');

class MessageService {
  // Create a new message
  async createMessage(messageData) {
    try {
      // Validate input
      if (!messageData.content || messageData.content.trim().length === 0) {
        throw new Error('Message content is required');
      }
      
      if (messageData.content.length > 1000) {
        throw new Error('Message content must be less than 1000 characters');
      }

      // Verify that the room exists
      const room = await Room.findById(messageData.roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Verify that the user is a member of the room
      if (!room.members.includes(messageData.userId)) {
        throw new Error('User is not a member of this room');
      }

      const message = new Message({
        ...messageData,
        content: messageData.content.trim()
      });
      await message.save();
      
      // Populate user information
      await message.populate('userId', 'username');
      return message;
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  // Get messages for a room
  async getMessagesByRoom(roomId, limit = 50, offset = 0, since = null) {
    try {
      // Build query conditions
      const conditions = { 
        roomId: roomId,
        isDeleted: false
      };
      
      // Add since condition if provided
      if (since) {
        conditions._id = { $gt: since };
      }
      
      const messages = await Message.find(conditions)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .populate('userId', 'username');
      
      return messages.reverse(); // Return in chronological order
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  // Get message by ID
  async getMessageById(messageId) {
    try {
      const message = await Message.findById(messageId).populate('userId', 'username');
      return message;
    } catch (error) {
      throw new Error(`Failed to fetch message: ${error.message}`);
    }
  }

  // Update message (edit)
  async updateMessage(messageId, updateData, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is the author of the message
      if (message.userId.toString() !== userId) {
        throw new Error('Unauthorized: Only message author can edit the message');
      }

      // Update message content and set edited timestamp
      message.content = updateData.content;
      message.editedAt = new Date();
      await message.save();
      
      // Populate user information
      await message.populate('userId', 'username');
      return message;
    } catch (error) {
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  // Delete message (soft delete)
  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new Error('Message not found');
      }

      // Check if user is the author of the message
      if (message.userId.toString() !== userId) {
        throw new Error('Unauthorized: Only message author can delete the message');
      }

      // Soft delete by setting isDeleted to true
      message.isDeleted = true;
      await message.save();
      return message;
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  // Get message count for a room
  async getMessageCount(roomId) {
    try {
      const count = await Message.countDocuments({ 
        roomId: roomId,
        isDeleted: false
      });
      return count;
    } catch (error) {
      throw new Error(`Failed to count messages: ${error.message}`);
    }
  }
}

module.exports = new MessageService();
