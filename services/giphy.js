const axios = require('axios');
require('dotenv').config();

class GiphyService {
  constructor() {
    this.apiKey = process.env.GIPHY_API_KEY || '';
    this.baseUrl = 'https://api.giphy.com/v1/gifs';
  }

  // Search for GIFs
  async searchGifs(query, limit = 24, offset = 0) {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY_API_KEY is not configured');
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          api_key: this.apiKey,
          q: query,
          limit: limit,
          offset: offset,
          rating: 'g'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching GIFs:', error.message);
      throw new Error('Failed to search GIFs');
    }
  }

  // Get trending GIFs
  async getTrendingGifs(limit = 24, offset = 0) {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY_API_KEY is not configured');
      }

      const response = await axios.get(`${this.baseUrl}/trending`, {
        params: {
          api_key: this.apiKey,
          limit: limit,
          offset: offset,
          rating: 'g'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching trending GIFs:', error.message);
      throw new Error('Failed to fetch trending GIFs');
    }
  }

  // Get a specific GIF by ID
  async getGifById(gifId) {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY_API_KEY is not configured');
      }

      const response = await axios.get(`${this.baseUrl}/${gifId}`, {
        params: {
          api_key: this.apiKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching GIF:', error.message);
      throw new Error('Failed to fetch GIF');
    }
  }
}

module.exports = new GiphyService();
