# Setup and Installation Guide

This guide provides detailed instructions for setting up and installing the Live Chat Server application in both development and production environments.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Docker** and **Docker Compose** (recommended for both development and production)
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Verify installation: 
     - `docker --version`
     - `docker-compose --version`

4. **Git** (for cloning the repository)
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - Verify installation: `git --version`

5. **Giphy API Key** (required for GIF functionality)
   - Register for a free API key at [developers.giphy.com](https://developers.giphy.com/)
   - You must set a valid GIPHY_API_KEY in your `.env` file for GIF search to work.

6. **Google OAuth Credentials** (optional, for Google login)
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/)

7. **Facebook App Credentials** (optional, for Facebook login)
   - Create an app in [Facebook Developers](https://developers.facebook.com/)

## Cloning the Repository

Clone the repository to your local machine:

```bash
git clone git@github.com:leonyonz/live-chat-server.git
cd live-chat-server
```

## Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file to set your configuration:
- MongoDB credentials
- JWT secret (generate a secure random string)
- Google/Facebook OAuth credentials (if using social login)
- **Giphy API key**: Replace the placeholder with your real API key from https://developers.giphy.com/ (required for GIF search)
- Frontend URL

## Development Setup

### Using Docker (Recommended for Development)

Start the application with Docker Compose (includes MongoDB):

```bash
docker-compose up --build
```

This will start both the MongoDB database and the application. The application will be available at http://localhost:3000.

To rebuild and restart after code changes:

```bash
docker-compose up --build --force-recreate
```

### Manual Setup (Alternative for Development)

If you prefer to run without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB separately (ensure it's running on the default port or update your .env file)

3. Run the application:
   ```bash
   npm run dev
   ```

This will start the application with nodemon, which automatically restarts the server when code changes are detected.

## Production Setup

For production deployment, please refer to the [Deployment Guide](Deployment-Guide.md) which provides detailed instructions for setting up the application in a production environment.

## Accessing the Application

After starting the application, you can access it at:

- Main application: http://localhost:3000
- Direct widget access: http://localhost:3000/widget.html

## Creating an Admin User

To access the admin dashboard, you need to create an admin user. During development, you can use the following command:

```bash
docker-compose exec app node scripts/create-admin.js --username admin --email admin@example.com --password securepassword
```

For production environments, please refer to the [Creating Admin Users](Creating-Admin-Users.md) guide.

## Verifying the Installation

To verify that the application is running correctly:

1. Open your browser and navigate to http://localhost:3000
2. You should see the main chat interface with a chat bubble
3. Click the chat bubble to open the chat window
4. Try logging in as a guest to test basic functionality

Check the logs to ensure there are no errors:

```bash
# If using Docker
docker-compose logs app

# If running manually
# Check the terminal where you ran npm run dev
```

## Common Issues and Solutions

### Port Conflicts

If you encounter port conflicts:

1. Check if another application is using port 3000:
   ```bash
   lsof -i :3000
   ```

2. If another application is using the port, you can either:
   - Stop the conflicting application
   - Change the port in your `.env` file

### MongoDB Connection Issues

If you're having trouble connecting to MongoDB:

1. Ensure MongoDB is running (if using manual setup)
2. Verify the MONGODB_URI in your `.env` file
3. Check that the MongoDB credentials are correct

### Missing Dependencies

If you encounter missing dependency errors:

1. Ensure you've run `npm install`
2. If using Docker, try rebuilding the containers:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

## Next Steps

After successfully installing the application, you may want to:

1. Configure social authentication (Google/Facebook)
2. Customize the chat interface
3. Explore the admin dashboard
4. Learn about [embedding the chat widget](Embedding-the-Chat-Widget.md) on other websites
5. Review the [configuration options](Configuration.md) for advanced customization
