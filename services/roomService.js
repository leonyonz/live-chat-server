const Room = require('../models/Room');
const User = require('../models/User');

class RoomService {
  // Create a new room
  async createRoom(roomData, userId) {
    try {
      // Validate input
      if (!roomData.name || roomData.name.trim().length === 0) {
        throw new Error('Room name is required');
      }
      
      if (roomData.name.length > 50) {
        throw new Error('Room name must be less than 50 characters');
      }
      
      if (roomData.description && roomData.description.length > 200) {
        throw new Error('Room description must be less than 200 characters');
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Check if room with this name already exists
      const existingRoom = await Room.findOne({ 
        name: roomData.name.trim(),
        isActive: true 
      });
      
      if (existingRoom) {
        throw new Error('A room with this name already exists');
      }

      const room = new Room({
        ...roomData,
        name: roomData.name.trim(),
        description: roomData.description ? roomData.description.trim() : undefined,
        createdBy: userId,
        members: [userId]
      });

      await room.save();
      return room;
    } catch (error) {
      throw new Error(`Failed to create room: ${error.message}`);
    }
  }

  // Get all public rooms
  async getPublicRooms() {
    try {
      const rooms = await Room.find({ 
        isPrivate: false, 
        isActive: true 
      }).populate('createdBy', 'username');
      return rooms;
    } catch (error) {
      throw new Error(`Failed to fetch public rooms: ${error.message}`);
    }
  }

  // Get room by ID
  async getRoomById(roomId) {
    try {
      const room = await Room.findById(roomId).populate('createdBy', 'username');
      return room;
    } catch (error) {
      throw new Error(`Failed to fetch room: ${error.message}`);
    }
  }

  // Update room
  async updateRoom(roomId, updateData, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if user is the creator of the room
      if (room.createdBy.toString() !== userId) {
        throw new Error('Unauthorized: Only room creator can update the room');
      }

      Object.assign(room, updateData);
      await room.save();
      return room;
    } catch (error) {
      throw new Error(`Failed to update room: ${error.message}`);
    }
  }

  // Delete room
  async deleteRoom(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if user is the creator of the room
      if (room.createdBy.toString() !== userId) {
        throw new Error('Unauthorized: Only room creator can delete the room');
      }

      // Soft delete by setting isActive to false
      room.isActive = false;
      await room.save();
      return room;
    } catch (error) {
      throw new Error(`Failed to delete room: ${error.message}`);
    }
  }

  // Add user to room
  async addUserToRoom(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if room is private
      if (room.isPrivate) {
        throw new Error('Cannot join private room without invitation');
      }

      // Check if user is already a member
      if (room.members.includes(userId)) {
        throw new Error('User is already a member of this room');
      }

      // Check if room is at capacity
      if (room.members.length >= room.maxMembers) {
        throw new Error('Room is at maximum capacity');
      }

      room.members.push(userId);
      await room.save();
      return room;
    } catch (error) {
      throw new Error(`Failed to add user to room: ${error.message}`);
    }
  }

  // Remove user from room
  async removeUserFromRoom(roomId, userId) {
    try {
      const room = await Room.findById(roomId);
      if (!room) {
        throw new Error('Room not found');
      }

      // Remove user from members array
      room.members = room.members.filter(member => member.toString() !== userId);
      await room.save();
      return room;
    } catch (error) {
      throw new Error(`Failed to remove user from room: ${error.message}`);
    }
  }
}

module.exports = new RoomService();
