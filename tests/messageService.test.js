const MessageService = require('../services/messageService');
const Message = require('../models/Message');
const Room = require('../models/Room');
const mongoose = require('mongoose');

// Mock the database models
jest.mock('../models/Message');
jest.mock('../models/Room');

describe('MessageService', () => {
  let mockUserId;
  let mockRoomId;
  let mockMessageData;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock data
    mockUserId = new mongoose.Types.ObjectId();
    mockRoomId = new mongoose.Types.ObjectId();
    mockMessageData = {
      roomId: mockRoomId,
      userId: mockUserId,
      username: 'testuser',
      content: 'This is a test message',
      messageType: 'text'
    };
  });
  
  describe('createMessage', () => {
    it('should create a new message successfully', async () => {
      // Mock Room.findById to return a room with the user as a member
      Room.findById.mockResolvedValue({ 
        _id: mockRoomId, 
        members: [mockUserId] 
      });
      
      // Mock Message.prototype.save to resolve successfully
      const mockMessage = {
        ...mockMessageData,
        _id: new mongoose.Types.ObjectId(),
        createdAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockResolvedValue(true)
      };
      
      Message.mockImplementation(() => mockMessage);
      
      // Call the service method
      const result = await MessageService.createMessage(mockMessageData);
      
      // Assertions
      expect(Room.findById).toHaveBeenCalledWith(mockRoomId);
      expect(result.content).toBe(mockMessageData.content);
      expect(result.userId).toBe(mockUserId);
    });
    
    it('should throw an error if room is not found', async () => {
      // Mock Room.findById to return null
      Room.findById.mockResolvedValue(null);
      
      // Expect the service method to throw an error
      await expect(MessageService.createMessage(mockMessageData))
        .rejects
        .toThrow('Room not found');
    });
    
    it('should throw an error if user is not a member of the room', async () => {
      // Mock Room.findById to return a room where the user is not a member
      Room.findById.mockResolvedValue({ 
        _id: mockRoomId, 
        members: [new mongoose.Types.ObjectId()] // Different user ID
      });
      
      // Expect the service method to throw an error
      await expect(MessageService.createMessage(mockMessageData))
        .rejects
        .toThrow('User is not a member of this room');
    });
    
    it('should throw an error if message content is missing', async () => {
      // Mock Room.findById to return a room with the user as a member
      Room.findById.mockResolvedValue({ 
        _id: mockRoomId, 
        members: [mockUserId] 
      });
      
      // Try to create a message with missing content
      const invalidMessageData = { ...mockMessageData, content: '' };
      
      // Expect the service method to throw an error
      await expect(MessageService.createMessage(invalidMessageData))
        .rejects
        .toThrow('Message content is required');
    });
  });
  
  describe('getMessagesByRoom', () => {
    it('should return messages for a room', async () => {
      // Mock Message.find to return an array of messages
      const mockMessages = [
        { 
          _id: new mongoose.Types.ObjectId(), 
          content: 'Message 1',
          userId: { _id: mockUserId, username: 'testuser' }
        },
        { 
          _id: new mongoose.Types.ObjectId(), 
          content: 'Message 2',
          userId: { _id: mockUserId, username: 'testuser' }
        }
      ];
      
      Message.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue([...mockMessages].reverse())
            })
          })
        })
      });
      
      // Call the service method
      const result = await MessageService.getMessagesByRoom(mockRoomId);
      
      // Assertions
      expect(Message.find).toHaveBeenCalledWith({
        roomId: mockRoomId,
        isDeleted: false
      });
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('Message 1');
    });
  });
  
  describe('updateMessage', () => {
    it('should update a message successfully', async () => {
      // Mock Message.findById to return a message by the same user
      const mockMessage = {
        _id: new mongoose.Types.ObjectId(),
        userId: mockUserId.toString(), // Convert to string to match the service implementation
        content: 'Original message',
        save: jest.fn().mockResolvedValue(true),
        populate: jest.fn().mockImplementation(function() {
          return Promise.resolve(this);
        })
      };
      
      Message.findById.mockResolvedValue(mockMessage);
      
      // Call the service method
      const updateData = { content: 'Updated message' };
      const result = await MessageService.updateMessage(
        mockMessage._id, 
        updateData, 
        mockUserId.toString() // Convert to string to match the service implementation
      );
      
      // Assertions
      expect(Message.findById).toHaveBeenCalledWith(mockMessage._id);
      expect(mockMessage.content).toBe(updateData.content);
      expect(mockMessage.editedAt).toBeDefined();
    });
    
    it('should throw an error if message is not found', async () => {
      // Mock Message.findById to return null
      Message.findById.mockResolvedValue(null);
      
      // Expect the service method to throw an error
      await expect(MessageService.updateMessage(
        new mongoose.Types.ObjectId(), 
        { content: 'Updated message' }, 
        mockUserId
      ))
        .rejects
        .toThrow('Message not found');
    });
    
    it('should throw an error if user is not the author', async () => {
      // Mock Message.findById to return a message by a different user
      const mockMessage = {
        _id: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(), // Different user ID
        content: 'Original message'
      };
      
      Message.findById.mockResolvedValue(mockMessage);
      
      // Expect the service method to throw an error
      await expect(MessageService.updateMessage(
        mockMessage._id, 
        { content: 'Updated message' }, 
        mockUserId // Different user ID
      ))
        .rejects
        .toThrow('Unauthorized: Only message author can edit the message');
    });
  });
});
