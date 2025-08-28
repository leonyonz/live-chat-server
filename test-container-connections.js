const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

console.log('Testing connections from within Docker container...\n');

// Test MongoDB connection
const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection...');
    // Use the Docker-specific MongoDB URI
    const conn = await mongoose.connect('mongodb://admin:password@mongodb:27017/livechat?authSource=admin', {
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
    // Use the API key from .env or a default one
    const apiKey = process.env.GIPHY_API_KEY || 'dc6zaTOxFJmzC';
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=1`;
    
    const response = await axios.get(url);
    if (response.status === 200) {
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
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  console.log('- GIPHY_API_KEY:', process.env.GIPHY_API_KEY ? 'Set' : 'Not set\n');
  
  const dbResult = await connectDB();
  const giphyResult = await testGiphyAPI();
  
  console.log('Connection test results:');
  console.log(`- Database: ${dbResult ? 'SUCCESS' : 'FAILED'}`);
  console.log(`- Giphy API: ${giphyResult ? 'SUCCESS' : 'FAILED'}`);
  
  if (dbResult && giphyResult) {
    console.log('\n🎉 All connections are working properly!');
  } else {
    console.log('\n⚠️  Some connections failed. Please check the errors above.');
  }
})();
