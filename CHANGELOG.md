# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Fixed chat messages not displaying due to users not being added to room members
- Corrected MongoDB connection URI in .env file for docker-compose environment
- Updated server-side room membership logic to properly add users when joining rooms
- Modified frontend widget to pass userId when joining rooms

### Known Issues
- Cross-device message synchronization - Messages sent from one device are not visible on other devices

## [1.0.0] - 2025-08-27

### Added
- Initial release of the live chat server
- Real-time messaging with Socket.IO
- Guest login functionality
- Google and Facebook OAuth integration
- GIF support via Giphy API
- Room-based chat system
- Message persistence in MongoDB
