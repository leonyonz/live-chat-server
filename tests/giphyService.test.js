const GiphyService = require('../services/giphy');
const axios = require('axios');

// Mock axios
jest.mock('axios');

describe('GiphyService', () => {
  const mockApiKey = 'test_api_key';
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set the API key in the service
    GiphyService.apiKey = mockApiKey;
  });
  
  describe('searchGifs', () => {
    it('should search for GIFs successfully', async () => {
      // Mock axios.get to return sample data
      const mockResponse = {
        data: {
          data: [
            { id: '1', url: 'http://example.com/gif1', images: {} },
            { id: '2', url: 'http://example.com/gif2', images: {} }
          ]
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      // Call the service method
      const query = 'funny';
      const result = await GiphyService.searchGifs(query);
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.giphy.com/v1/gifs/search',
        {
          params: {
            api_key: mockApiKey,
            q: query,
            limit: 24,
            offset: 0,
            rating: 'g'
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
    
    it('should throw an error if API key is not configured', async () => {
      // Set API key to empty string
      GiphyService.apiKey = '';
      
      // Expect the service method to throw an error
      await expect(GiphyService.searchGifs('funny'))
        .rejects
        .toThrow('Failed to search GIFs');
    });
  });
  
  describe('getTrendingGifs', () => {
    it('should get trending GIFs successfully', async () => {
      // Mock axios.get to return sample data
      const mockResponse = {
        data: {
          data: [
            { id: '1', url: 'http://example.com/trend1', images: {} },
            { id: '2', url: 'http://example.com/trend2', images: {} }
          ]
        }
      };
      
      axios.get.mockResolvedValue(mockResponse);
      
      // Call the service method
      const result = await GiphyService.getTrendingGifs();
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.giphy.com/v1/gifs/trending',
        {
          params: {
            api_key: mockApiKey,
            limit: 24,
            offset: 0,
            rating: 'g'
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});
