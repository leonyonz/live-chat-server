# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-28

### Added
- Admin dashboard for managing users, rooms, and messages
- Role-based access control (RBAC) with user roles (user/admin)
- Secure CLI script for creating admin users (`scripts/create-admin.js`)
- Admin authentication middleware for protecting admin routes
- Admin API endpoints for user/room/message management
- Comprehensive admin frontend with dashboard, statistics, and management interfaces

### Security
- Removed insecure public endpoint for admin user creation
- Secured MongoDB by removing exposed port, now only accessible internally
- Implemented proper JWT-based authentication for admin access
- Added input validation and error handling for all admin functions
- Passwords are properly hashed using bcrypt before storage

### Changed
- Updated User model to include role field for RBAC
- Modified docker-compose configuration to improve security
- Enhanced server.js to include admin routes
- Improved overall application security posture

## [Unreleased]

### Fixed
- Fixed ObjectId casting issue when fetching messages by room name
- Fixed room creation issue with missing createdBy field
- Improved message synchronization between devices with better duplicate prevention
- Fixed user ID comparison inconsistency causing messages not to appear on other users' screens
- Fixed chat messages not displaying due to users not being added to room members
- Corrected MongoDB connection URI in .env file for docker-compose environment
- Updated server-side room membership logic to properly add users when joining rooms
- Modified frontend widget to pass userId when joining rooms
- Fixed cross-device message synchronization - Messages sent from one device are now visible on other devices of the same user

### Security
- Removed exposed MongoDB port from docker-compose.yml for improved security

### Known Issues
- None

## [1.0.0] - 2025-08-27

### Added
- Initial release of the live chat server
- Real-time messaging with Socket.IO
- Guest login functionality
- Google and Facebook OAuth integration
- GIF support via Giphy API
- Room-based chat system
- Message persistence in MongoDB
