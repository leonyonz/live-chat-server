#!/usr/bin/env node

/**
 * Script to create an admin user
 * Usage: 
 *   1. Direct execution: node scripts/create-admin.js --username <username> --email <email> --password <password>
 *   2. Docker execution: docker-compose exec app node scripts/create-admin.js --username <username> --email <email> --password <password>
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
// const connectDB = require('../config/database');

// Database connection for CLI script
async function connectDB() {
  // Use the same connection string as the app, which works within Docker network
  const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:password@mongodb:27017/livechat?authSource=admin';
  
  try {
    console.log('Connecting to MongoDB...');
    return await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i].replace('--', '');
  const value = process.argv[i + 1];
  if (key && value) {
    args[key] = value;
  }
}

const { username, email, password } = args;

// Validate required arguments
if (!username || !email || !password) {
  console.error('Error: Missing required arguments');
  console.log('Usage: node scripts/create-admin.js --username <username> --email <email> --password <password>');
  console.log('Example: node scripts/create-admin.js --username admin --email admin@example.com --password securepassword');
  process.exit(1);
}

// Validate password strength
if (password.length < 8) {
  console.error('Error: Password must be at least 8 characters long');
  process.exit(1);
}

async function createAdminUser() {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Error: User with this email already exists');
      process.exit(1);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Create new admin user
    const user = new User({
      username: username.trim(),
      email: email.trim(),
      password: hashedPassword,
      provider: 'local',
      role: 'admin'
    });

    await user.save();
    console.log('Admin user created successfully:');
    console.log(`  Username: ${user.username}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  User ID: ${user._id}`);

    // Disconnect from database
    await mongoose.connection.close();
    console.log('Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
