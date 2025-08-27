const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
require('dotenv').config();

// Google Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ providerId: profile.id, provider: 'google' });
      
      if (user) {
        // Update last seen
        user.lastSeen = Date.now();
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        provider: 'google',
        providerId: profile.id,
        username: profile.displayName,
        email: profile.emails ? profile.emails[0].value : undefined,
        avatar: profile.photos ? profile.photos[0].value : undefined
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Facebook Strategy (only if credentials are provided)
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails', 'photos']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ providerId: profile.id, provider: 'facebook' });
      
      if (user) {
        // Update last seen
        user.lastSeen = Date.now();
        await user.save();
        return done(null, user);
      }
      
      // Create new user
      user = new User({
        provider: 'facebook',
        providerId: profile.id,
        username: profile.displayName,
        email: profile.emails ? profile.emails[0].value : undefined,
        avatar: profile.photos ? profile.photos[0].value : undefined
      });
      
      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
