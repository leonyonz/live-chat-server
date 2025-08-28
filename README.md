# Live Chat Server

A Chatango-like live chat application with the following features:
1. User can login as guest
2. User can login as Gmail/FB
3. Apps connect to Giphy
4. Live chat can be embedded to other websites
5. If chat embedded, the chat will show as bubble and when click it will open the chatbox area

## Features
- Real-time messaging with Socket.IO
- Multiple authentication options (Guest, Google, Facebook)
- Giphy integration for sharing GIFs
- Embeddable chat widget with bubble UI
- Persistent chat history with MongoDB
- Responsive design for all devices
- Admin dashboard for user/room/message management

## Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (recommended)
- **Giphy API Key** (required for GIF functionality)

### Using Docker (Recommended)
```bash
# Clone the repository
git clone git@github.com:leonyonz/live-chat-server.git
cd live-chat-server

# Create environment file
cp .env.example .env
# Edit .env to add your Giphy API key and other configurations

# Start the application
docker-compose up --build

# Access the application at http://localhost:3000
```

### Manual Setup
```bash
# Clone the repository
git clone git@github.com:leonyonz/live-chat-server.git
cd live-chat-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env to configure your settings

# Run the application
npm run dev

# Access the application at http://localhost:3000
```

## Documentation

For detailed documentation, please refer to our [Wiki](https://github.com/leonyonz/live-chat-server/wiki):

- [Home](https://github.com/leonyonz/live-chat-server/wiki)
- [Setup and Installation Guide](https://github.com/leonyonz/live-chat-server/wiki/Setup-and-Installation)
- [Configuration Guide](https://github.com/leonyonz/live-chat-server/wiki/Configuration)
- [Deployment Guide](https://github.com/leonyonz/live-chat-server/wiki/Deployment-Guide)
- [Admin Dashboard Guide](https://github.com/leonyonz/live-chat-server/wiki/Admin-Dashboard-Guide)
- [API Documentation](https://github.com/leonyonz/live-chat-server/wiki/API-Documentation)
- [Debugging Guide](https://github.com/leonyonz/live-chat-server/wiki/Debugging-Guide)
- [Changelog](https://github.com/leonyonz/live-chat-server/wiki/Changelog)

You can also browse the documentation directly in the repository at [docs/wiki/](docs/wiki/).

### Managing Documentation via CLI

To update the GitHub wiki with the latest documentation from the repository, you can use the provided scripts in the repository that automate the process of syncing documentation to the wiki.

## Project Structure

```
live-chat-server/
├── config/                 # Configuration files
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── services/               # Business logic
├── public/                 # Frontend assets
├── tests/                  # Unit and integration tests
├── wordpress-plugin/       # WordPress integration plugin
├── scripts/                # Utility scripts
├── middleware/             # Express middleware
└── docs/                   # Documentation files
```

## Key Features

1. **Real-time Messaging**: Implemented with Socket.IO for instant message delivery
2. **Multiple Authentication Options**:
   - Guest login (no account required)
   - Google OAuth integration
   - Facebook OAuth integration
3. **Giphy Integration**: Search and send animated GIFs in chat
4. **Embeddable Chat Widget**:
   - Bubble UI that expands to full chat when clicked
   - Can be embedded on any website using the embed.js script
5. **Persistent Chat History**: Messages stored in MongoDB
6. **Responsive Design**: Works on desktop and mobile devices
7. **Admin Dashboard**: Comprehensive management interface

## Available Scripts

- `npm start`: Run the application
- `npm run dev`: Run the application with nodemon for development
- `npm test`: Run unit tests
- `npm run test:all`: Run all tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the maintainers.
