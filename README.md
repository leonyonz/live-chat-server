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

## Development Approach
- Branch-per-feature development
- Docker for staging/development environments
- Node.js + Express backend
- React frontend
- MongoDB for data persistence

## Running Modes

### Development Mode
Development mode is designed for active development with features like auto-reload when code changes:

**Using Docker (Recommended):**
```bash
# Start services with hot-reloading
docker-compose up --build

# To rebuild and restart after code changes
docker-compose up --build --force-recreate
```

**Manual Setup:**
```bash
# Install dependencies
npm install

# Run with nodemon for auto-reload on code changes
npm run dev

# Or run normally
npm start
```

In development mode:
- Debug logging is enabled
- Hot-reloading is available
- Detailed error messages are shown
- MongoDB is accessible on the default port (when not using Docker)

### Production Mode
Production mode is optimized for performance and security:

**Using Docker (Recommended):**
```bash
# Build and start in production mode
docker-compose -f docker-compose.yml up --build -d
```

**Manual Setup:**
```bash
# Install dependencies
npm install

# Set environment variables
export NODE_ENV=production

# Run the application
npm start
```

In production mode:
- Logging is minimized
- Performance optimizations are enabled
- Error messages are generic to prevent information leakage
- MongoDB is not exposed to external connections (security enhancement)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Docker** and **Docker Compose**
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

## Setup Instructions

### 1. Clone the Repository
```bash
git clone git@github.com:leonyonz/live-chat-server.git
cd live-chat-server
```

### 2. Environment Configuration
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

### 3. Using Docker (Recommended)
Start the application with Docker Compose (includes MongoDB):
```bash
docker-compose up --build
```

This will start both the MongoDB database and the application.

### 4. Manual Setup (Alternative)
If you prefer to run without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start MongoDB separately (ensure it's running on the default port or update your .env file)

3. Run the application:
   ```bash
   npm start
   ```

4. For development with auto-reload:
   ```bash
   npm run dev
   ```

### 5. Access the Application
- Main application: http://localhost:3000
- Direct widget access: http://localhost:3000/widget.html

## Project Structure

```
live-chat-server/
├── config/                 # Configuration files
│   ├── database.js         # MongoDB connection
│   └── passport.js         # Authentication strategies
├── models/                 # MongoDB schemas
│   ├── User.js             # User model
│   ├── Room.js             # Chat room model
│   └── Message.js          # Message model
├── routes/                 # API routes
│   ├── auth.js             # Authentication routes
│   ├── giphy.js            # Giphy API routes
│   ├── rooms.js            # Chat room routes
│   └── messages.js         # Message routes
├── services/               # Business logic
│   ├── giphy.js            # Giphy service
│   ├── roomService.js      # Room management
│   └── messageService.js   # Message handling
├── public/                 # Frontend assets
│   ├── index.html          # Main page with chat bubble
│   ├── widget.html         # Standalone chat widget
│   ├── styles.css          # Styling for both interfaces
│   ├── widget.js           # Functionality for widget
│   └── embed.js            # Script for embedding on other sites
├── tests/                  # Unit and integration tests
├── Dockerfile              # Docker configuration for app
├── docker-compose.yml      # Docker Compose for full stack
├── server.js               # Main application entry point
├── package.json            # Dependencies and scripts
└── .env.example            # Environment variable template
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

## Available Scripts

- `npm start`: Run the application
- `npm run dev`: Run the application with nodemon for development
- `npm test`: Run unit tests
- `npm run test:all`: Run all tests

## API Endpoints

- **Authentication**: `/api/auth/`
  - POST `/guest` - Guest login
  - GET `/google` - Google OAuth
  - GET `/facebook` - Facebook OAuth
- **Giphy**: `/api/giphy/`
  - GET `/search/:query` - Search GIFs
  - GET `/trending` - Get trending GIFs
  - GET `/:id` - Get specific GIF
- **Rooms**: `/api/rooms/`
  - POST `/` - Create room
  - GET `/` - Get all public rooms
  - GET `/:id` - Get specific room
  - PUT `/:id` - Update room
  - DELETE `/:id` - Delete room
  - POST `/:id/join` - Join room
  - POST `/:id/leave` - Leave room
- **Messages**: `/api/messages/`
  - POST `/` - Create message
  - GET `/room/:roomId` - Get messages for room
  - GET `/:id` - Get specific message
  - PUT `/:id` - Update message
  - DELETE `/:id` - Delete message

## Embedding the Chat Widget

To embed the chat widget on another website, include the following script:

```html
<script src="http://localhost:3000/embed.js"></script>
```

Replace `localhost:3000` with your actual server URL in production.

### WordPress Integration

For WordPress users, we've created a dedicated plugin that makes it even easier to embed the chat widget:

1. Navigate to the `wordpress-plugin` directory in the project
2. Copy the `live-chat-wordpress` folder to your WordPress plugins directory (`wp-content/plugins/`)
3. Activate the plugin through the WordPress admin panel
4. Go to Settings > Live Chat to configure the plugin with your server URL
5. The chat widget will automatically appear on your site

Alternatively, you can use the shortcode `[live_chat]` to embed the chat in specific posts or pages.

## Admin Dashboard

The application includes a comprehensive admin dashboard for managing the chat system. The dashboard provides administrators with tools to monitor and control users, rooms, and messages.

### Accessing the Admin Dashboard

1. Create an admin user using the secure CLI script:
   ```bash
   docker-compose exec app node scripts/create-admin.js --username admin --email admin@example.com --password securepassword
   ```

2. Access the admin dashboard at: http://localhost:3000/admin

3. Log in with the admin credentials created in step 1

### Admin Dashboard Features

- **Dashboard Overview**: Statistics on total users, rooms, and messages
- **User Management**: View, promote/demote, and delete users
- **Room Management**: View and delete chat rooms
- **Message Moderation**: View and delete messages
- **Real-time Monitoring**: See recent activity across the platform
- **Search & Pagination**: Efficiently browse through large datasets

### Security

- Admin creation requires direct server access (cannot be done remotely)
- All admin actions require JWT authentication
- MongoDB is not exposed externally, only accessible within the Docker network
- Passwords are securely hashed using bcrypt

## Debugging

This application includes a comprehensive debugging system that allows you to control the verbosity of logs in both client-side and server-side components.

### How It Works

The debugging system is controlled by the `DEBUG_ENABLED` environment variable in the `.env` file. When set to `true`, debug messages will be logged to the console. When set to `false`, debug messages will be suppressed.

### Configuration

#### Server-Side Debugging

The server-side debugging is controlled by the `DEBUG_ENABLED` variable in the `.env` file:

```env
DEBUG_ENABLED=true
```

When `DEBUG_ENABLED=true`, the server will output detailed logs for:
- Socket.io connections and disconnections
- Room join events
- Message sending and receiving
- Database operations
- Error conditions

#### Client-Side Debugging

Client-side debugging can be controlled in two ways:

1. **Environment Variable**: The client checks the `DEBUG_ENABLED` variable from the server's `.env` file.
2. **URL Parameter**: You can override the debugging setting by adding `?debug=true` or `?debug=false` to the URL.

For example:
- `http://localhost:3000/?debug=true` - Enables debugging
- `http://localhost:3000/?debug=false` - Disables debugging (even if `DEBUG_ENABLED=true` in .env)

### Usage

#### Enabling Debug Mode

1. Set `DEBUG_ENABLED=true` in your `.env` file
2. Restart the server
3. Open the application in your browser
4. Open the browser's developer console to view the logs

#### Disabling Debug Mode

1. Set `DEBUG_ENABLED=false` in your `.env` file
2. Restart the server
3. The console logs will be suppressed

Alternatively, you can temporarily disable debugging for a specific session by adding `?debug=false` to the URL.

### Debug Output Format

Debug messages are prefixed to distinguish them from other console output:

- **Client-side**: `[LiveChat Debug]`
- **Admin panel**: `[LiveChat Admin Debug]`
- **Server-side**: `[Server Debug]`

For more detailed information about the debugging system, see [DEBUGGING.md](DEBUGGING.md).
