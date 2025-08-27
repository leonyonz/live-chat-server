const express = require('express');
const giphyService = require('../services/giphy');

const router = express.Router();

// Search GIFs
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 24, offset = 0 } = req.query;
    
    const gifs = await giphyService.searchGifs(query, parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: gifs
    });
  } catch (error) {
    console.error('Error in /search route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to search GIFs'
    });
  }
});

// Get trending GIFs
router.get('/trending', async (req, res) => {
  try {
    const { limit = 24, offset = 0 } = req.query;
    
    const gifs = await giphyService.getTrendingGifs(parseInt(limit), parseInt(offset));
    
    res.json({
      success: true,
      data: gifs
    });
  } catch (error) {
    console.error('Error in /trending route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending GIFs'
    });
  }
});

// Get specific GIF by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const gif = await giphyService.getGifById(id);
    
    res.json({
      success: true,
      data: gif
    });
  } catch (error) {
    console.error('Error in /:id route:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch GIF'
    });
  }
});

module.exports = router;
