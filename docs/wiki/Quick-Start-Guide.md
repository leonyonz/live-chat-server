# Quick Start Guide

This guide provides a fast track to getting the Live Chat Server application up and running in development mode.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose** (recommended)
- **Git** for cloning the repository

## Quick Installation

### 1. Clone the Repository
```bash
git clone https://github.com/leonyonz/live-chat-server.git
cd live-chat-server
```

### 2. Set Up Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env to add your Giphy API key
nano .env
```

### 3. Start the Application
```bash
# Using Docker (recommended)
docker-compose up --build

# Or without Docker (alternative)
npm install
npm run dev
```

### 4. Access the Application
Open your browser and navigate to:
- Main application: http://localhost:3000
- Direct widget access: http://localhost:3000/widget.html

## Testing the Installation

1. Click the chat bubble on the main page
2. Enter a username to log in as a guest
3. Type a message in the chat
4. Open a second browser window to the same URL
5. Log in with a different username
6. Send messages between both windows

## Next Steps

After verifying the installation works:

1. **Configure Social Authentication**:
   - Add Google OAuth credentials to `.env`
   - Add Facebook App credentials to `.env`

2. **Explore the Admin Dashboard**:
   - Create an admin user: `docker-compose exec app node scripts/create-admin.js --username admin --email admin@example.com --password securepassword`
   - Access the dashboard: http://localhost:3000/admin

3. **Customize the Interface**:
   - Modify `public/styles.css` for styling
   - Update `public/index.html` for layout changes

4. **Learn About Embedding**:
   - Read the [Embedding the Chat Widget](Embedding-the-Chat-Widget.md) guide
   - Test embedding on another website

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Check what's using port 3000
lsof -i :3000
# Kill the process or change the PORT in .env
```

**Docker Permission Denied**:
```bash
# Add your user to the docker group
sudo usermod -aG docker $USER
# Log out and back in
```

**Missing Dependencies**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Need Help?

- Check the full [Setup and Installation Guide](Setup-and-Installation.md)
- Review the [Configuration Guide](Configuration.md)
- Visit the [GitHub Issues](https://github.com/leonyonz/live-chat-server/issues) page
