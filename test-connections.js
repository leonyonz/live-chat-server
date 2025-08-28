const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connections...\n');

// Test MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/livechat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✓ MongoDB Connected: ${conn.connection.host}\n`);
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.error(`✗ Error connecting to MongoDB: ${error.message}\n`);
    return false;
  }
};

// Test Giphy API connection
const testGiphyAPI = async () => {
  try {
    console.log('Attempting Giphy API connection...');
    const apiKey = process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC'; // Default public beta key
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=1`;
    
    const response = await fetch(url);
    if (response.ok) {
      console.log('✓ Giphy API is accessible\n');
      return true;
    } else {
      console.error(`✗ Giphy API returned status: ${response.status}\n`);
      return false;
    }
  } catch (error) {
    console.error(`✗ Error connecting to Giphy API: ${error.message}\n`);
    return false;
  }
};

// Run tests
(async () => {
  console.log('Environment variables:');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set (using default)');
  console.log('- GIPHY_API_KEY:', process.env.GIPHY_API_KEY ? 'Set' : 'Not set (using default)\n');
  
  const dbResult = await connectDB();
  const giphyResult = await testGiphyAPI();
  
  console.log('Connection test results:');
  console.log(`- Database: ${dbResult ? 'SUCCESS' : 'FAILED'}`);
  console.log(`- Giphy API: ${giphyResult ? 'SUCCESS' : 'FAILED'}`);
})();
