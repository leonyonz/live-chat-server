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

### Added
- WordPress plugin for easy integration with WordPress sites
- WordPress plugin includes admin settings page for configuration
- WordPress shortcode support for embedding chat in posts/pages
- Documentation for WordPress integration in README

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

## Versioning Scheme

This project follows Semantic Versioning (SemVer):

- MAJOR version when you make incompatible API changes
- MINOR version when you add functionality in a backwards compatible manner
- PATCH version when you make backwards compatible bug fixes

### Major Version 1.x.x

The 1.x.x series represents the initial stable release of the Live Chat Server.

#### 1.1.x Series

The 1.1.x series introduced administrative capabilities and enhanced security features.

##### 1.1.0
- First release with admin dashboard and RBAC
- Security enhancements for production deployments

#### 1.0.x Series

The 1.0.x series represented the initial feature-complete release.

##### 1.0.0
- Initial stable release with core chat functionality

## Release Process

Our release process follows these steps:

1. All changes are first merged to the `develop` branch
2. When ready for a release, changes are merged to `main` branch
3. A new version tag is created following SemVer
4. Release notes are updated in this CHANGELOG.md file
5. Docker images are tagged with the version number
6. GitHub release is created with binaries and release notes

## Deprecation Policy

When we deprecate a feature:

1. We announce it in the release notes
2. We provide a migration path in the documentation
3. The deprecated feature remains functional for at least one minor version
4. We remove the feature in a future major version

## Upgrading

### Upgrading to 1.1.0

When upgrading from 1.0.0 to 1.1.0:

1. Run the admin user creation script to create your first admin user
2. Update your `.env` file with any new required variables
3. Review the security enhancements in the deployment documentation
4. Test the new admin dashboard functionality

### Upgrading from Unreleased Features

Features marked as [Unreleased] are available in the development branch but not yet part of a stable release. To use these features:

1. Clone the repository and switch to the `develop` branch
2. Follow the development setup instructions
3. Note that unreleased features may change before final release

## Reporting Issues

If you encounter issues with a specific version:

1. Check this changelog for known issues
2. Verify you're using the latest patch version
3. Search existing GitHub issues
4. Create a new issue with:
   - Version number where the issue occurs
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

## Roadmap

Planned features for future releases:

### 2.0.0 (Planned)
- Mobile app support
- Voice and video messaging
- End-to-end encryption
- Plugin architecture for extending functionality

### 1.2.0 (Planned)
- File sharing capabilities
- Chat bots support
- Advanced moderation tools
- Analytics dashboard

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch from `develop`
3. Make your changes
4. Add appropriate tests
5. Update documentation
6. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.

## Acknowledgements

Thanks to all contributors who have helped make this project better:

- Bug reporters
- Feature requesters
- Code contributors
- Documentation writers
- Translators
- Beta testers

## License Changes

Any changes to the license will be clearly documented in this section and in the LICENSE file.

As of version 1.1.0, this project is licensed under the MIT License.
