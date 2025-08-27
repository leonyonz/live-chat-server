const RoomService = require('../services/roomService');
const Room = require('../models/Room');
const User = require('../models/User');
const mongoose = require('mongoose');

// Mock the database models
jest.mock('../models/Room');
jest.mock('../models/User');

describe('RoomService', () => {
  let mockUserId;
  let mockRoomData;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock data
    mockUserId = new mongoose.Types.ObjectId();
    mockRoomData = {
      name: 'Test Room',
      description: 'A test room for unit testing',
      isPrivate: false
    };
  });
  
  describe('createRoom', () => {
    it('should create a new room successfully', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValue({ _id: mockUserId, username: 'testuser' });
      
      // Mock Room.findOne to return null (no existing room)
      Room.findOne.mockResolvedValue(null);
      
      // Mock Room.prototype.save to resolve successfully
      const mockRoom = {
        ...mockRoomData,
        _id: new mongoose.Types.ObjectId(),
        createdBy: mockUserId,
        members: [mockUserId],
        save: jest.fn().mockResolvedValue(true)
      };
      
      Room.mockImplementation(() => mockRoom);
      
      // Call the service method
      const result = await RoomService.createRoom(mockRoomData, mockUserId);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Room.findOne).toHaveBeenCalledWith({
        name: mockRoomData.name.trim(),
        isActive: true
      });
      expect(result.name).toBe(mockRoomData.name);
      expect(result.createdBy).toBe(mockUserId);
      expect(result.members).toContain(mockUserId);
    });
    
    it('should throw an error if user is not found', async () => {
      // Mock User.findById to return null
      User.findById.mockResolvedValue(null);
      
      // Expect the service method to throw an error
      await expect(RoomService.createRoom(mockRoomData, mockUserId))
        .rejects
        .toThrow('User not found');
    });
    
    it('should throw an error if room name already exists', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValue({ _id: mockUserId, username: 'testuser' });
      
      // Mock Room.findOne to return an existing room
      Room.findOne.mockResolvedValue({ name: 'Test Room' });
      
      // Expect the service method to throw an error
      await expect(RoomService.createRoom(mockRoomData, mockUserId))
        .rejects
        .toThrow('A room with this name already exists');
    });
    
    it('should throw an error if room name is missing', async () => {
      // Mock User.findById to return a user
      User.findById.mockResolvedValue({ _id: mockUserId, username: 'testuser' });
      
      // Try to create a room with missing name
      const invalidRoomData = { ...mockRoomData, name: '' };
      
      // Expect the service method to throw an error
      await expect(RoomService.createRoom(invalidRoomData, mockUserId))
        .rejects
        .toThrow('Room name is required');
    });
  });
  
  describe('getPublicRooms', () => {
    it('should return all public rooms', async () => {
      // Mock Room.find to return an array of rooms
      const mockRooms = [
        { _id: new mongoose.Types.ObjectId(), name: 'Room 1', isPrivate: false },
        { _id: new mongoose.Types.ObjectId(), name: 'Room 2', isPrivate: false }
      ];
      
      Room.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockRooms)
      });
      
      // Call the service method
      const result = await RoomService.getPublicRooms();
      
      // Assertions
      expect(Room.find).toHaveBeenCalledWith({
        isPrivate: false,
        isActive: true
      });
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Room 1');
    });
  });
});
