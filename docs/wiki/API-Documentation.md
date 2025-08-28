# API Documentation

This document provides detailed information about the REST API endpoints available in the Live Chat Server application.

## Authentication

Most API endpoints require authentication. The application uses JWT (JSON Web Tokens) for authentication.

### Obtaining a Token

For guest authentication:
```
POST /api/auth/guest
```

For Google OAuth:
```
GET /api/auth/google
```

For Facebook OAuth:
```
GET /api/auth/facebook
```

### Using a Token

Include the JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## API Endpoints

### Authentication Endpoints

#### Guest Login
```
POST /api/auth/guest
```

**Request Body:**
```json
{
  "username": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "role": "string"
  }
}
```

#### Google OAuth
```
GET /api/auth/google
```

Redirects to Google OAuth flow.

#### Google OAuth Callback
```
GET /api/auth/google/callback
```

Handles Google OAuth callback.

#### Facebook OAuth
```
GET /api/auth/facebook
```

Redirects to Facebook OAuth flow.

#### Facebook OAuth Callback
```
GET /api/auth/facebook/callback
```

Handles Facebook OAuth callback.

### Giphy Endpoints

#### Search GIFs
```
GET /api/giphy/search/:query
```

**Parameters:**
- `query` (path) - Search term

**Response:**
```json
[
  {
    "id": "string",
    "url": "string",
    "images": {
      "fixed_height": {
        "url": "string",
        "height": "string",
        "width": "string"
      }
    }
  }
]
```

#### Get Trending GIFs
```
GET /api/giphy/trending
```

**Response:**
```json
[
  {
    "id": "string",
    "url": "string",
    "images": {
      "fixed_height": {
        "url": "string",
        "height": "string",
        "width": "string"
      }
    }
  }
]
```

#### Get Specific GIF
```
GET /api/giphy/:id
```

**Parameters:**
- `id` (path) - GIF ID

**Response:**
```json
{
  "id": "string",
  "url": "string",
  "images": {
    "original": {
      "url": "string",
      "height": "string",
      "width": "string"
    }
  }
}
```

### Room Endpoints

#### Create Room
```
POST /api/rooms
```

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "createdBy": "string",
  "members": ["string"],
  "createdAt": "date"
}
```

#### Get All Public Rooms
```
GET /api/rooms
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "createdBy": "string",
    "memberCount": "number",
    "messageCount": "number",
    "createdAt": "date"
  }
]
```

#### Get Specific Room
```
GET /api/rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "createdBy": "string",
  "members": ["string"],
  "createdAt": "date"
}
```

#### Update Room
```
PUT /api/rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "createdBy": "string",
  "members": ["string"],
  "createdAt": "date"
}
```

#### Delete Room
```
DELETE /api/rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "message": "string"
}
```

#### Join Room
```
POST /api/rooms/:id/join
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "message": "string"
}
```

#### Leave Room
```
POST /api/rooms/:id/leave
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "message": "string"
}
```

### Message Endpoints

#### Create Message
```
POST /api/messages
```

**Request Body:**
```json
{
  "roomId": "string",
  "content": "string",
  "messageType": "string", // Optional, defaults to "text"
  "gifUrl": "string" // Required if messageType is "gif"
}
```

**Response:**
```json
{
  "id": "string",
  "roomId": "string",
  "userId": "string",
  "username": "string",
  "content": "string",
  "messageType": "string",
  "gifUrl": "string",
  "timestamp": "date"
}
```

#### Get Messages for Room
```
GET /api/messages/room/:roomId
```

**Parameters:**
- `roomId` (path) - Room ID

**Query Parameters:**
- `limit` (number) - Number of messages to retrieve (default: 50)
- `before` (string) - Get messages before this timestamp

**Response:**
```json
[
  {
    "id": "string",
    "roomId": "string",
    "userId": "string",
    "username": "string",
    "content": "string",
    "messageType": "string",
    "gifUrl": "string",
    "timestamp": "date"
  }
]
```

#### Get Specific Message
```
GET /api/messages/:id
```

**Parameters:**
- `id` (path) - Message ID

**Response:**
```json
{
  "id": "string",
  "roomId": "string",
  "userId": "string",
  "username": "string",
  "content": "string",
  "messageType": "string",
  "gifUrl": "string",
  "timestamp": "date"
}
```

#### Update Message
```
PUT /api/messages/:id
```

**Parameters:**
- `id` (path) - Message ID

**Request Body:**
```json
{
  "content": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "roomId": "string",
  "userId": "string",
  "username": "string",
  "content": "string",
  "messageType": "string",
  "gifUrl": "string",
  "timestamp": "date"
}
```

#### Delete Message
```
DELETE /api/messages/:id
```

**Parameters:**
- `id` (path) - Message ID

**Response:**
```json
{
  "message": "string"
}
```

### Admin Endpoints

All admin endpoints require admin privileges and JWT authentication.

#### Get Dashboard Statistics
```
GET /api/admin/stats
```

**Response:**
```json
{
  "totalUsers": "number",
  "totalRooms": "number",
  "totalMessages": "number",
  "recentActivity": [
    {
      "type": "string",
      "description": "string",
      "timestamp": "date"
    }
  ]
}
```

#### Get All Users
```
GET /api/admin/users
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `search` (string) - Search term
- `role` (string) - Filter by role (user, admin)
- `status` (string) - Filter by status (active, disabled)

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "string",
      "createdAt": "date",
      "lastLogin": "date"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalUsers": "number"
  }
}
```

#### Update User Role
```
PUT /api/admin/users/:id/role
```

**Parameters:**
- `id` (path) - User ID

**Request Body:**
```json
{
  "role": "string" // "user" or "admin"
}
```

**Response:**
```json
{
  "message": "string"
}
```

#### Delete User
```
DELETE /api/admin/users/:id
```

**Parameters:**
- `id` (path) - User ID

**Response:**
```json
{
  "message": "string"
}
```

#### Get All Rooms
```
GET /api/admin/rooms
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `search` (string) - Search term

**Response:**
```json
{
  "rooms": [
    {
      "id": "string",
      "name": "string",
      "createdBy": "string",
      "memberCount": "number",
      "messageCount": "number",
      "createdAt": "date"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalRooms": "number"
  }
}
```

#### Delete Room
```
DELETE /api/admin/rooms/:id
```

**Parameters:**
- `id` (path) - Room ID

**Response:**
```json
{
  "message": "string"
}
```

#### Get All Messages
```
GET /api/admin/messages
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 50)
- `search` (string) - Search term
- `roomId` (string) - Filter by room
- `userId` (string) - Filter by user

**Response:**
```json
{
  "messages": [
    {
      "id": "string",
      "roomId": "string",
      "userId": "string",
      "username": "string",
      "content": "string",
      "messageType": "string",
      "gifUrl": "string",
      "timestamp": "date"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalMessages": "number"
  }
}
```

#### Delete Message
```
DELETE /api/admin/messages/:id
```

**Parameters:**
- `id` (path) - Message ID

**Response:**
```json
{
  "message": "string"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Guest authentication: 10 requests per hour per IP
- Authenticated requests: 1000 requests per hour per user
- Admin requests: 2000 requests per hour per admin

Exceeding these limits will result in a 429 Too Many Requests response.

## WebSocket API

In addition to the REST API, the application uses WebSockets for real-time communication.

### Connection
Connect to `ws://your-domain.com` (or `wss://` for secure connections).

### Events

#### join-room
Join a chat room.

**Payload:**
```json
{
  "roomName": "string",
  "userName": "string",
  "userId": "string"
}
```

#### send-message
Send a text message.

**Payload:**
```json
{
  "roomName": "string",
  "message": "string",
  "userName": "string",
  "userId": "string"
}
```

#### send-gif
Send a GIF message.

**Payload:**
```json
{
  "roomName": "string",
  "gifUrl": "string",
  "userName": "string",
  "userId": "string"
}
```

#### receive-message
Receive a text message.

**Payload:**
```json
{
  "message": "string",
  "userName": "string",
  "userId": "string",
  "_id": "string",
  "timestamp": "date"
}
```

#### receive-gif
Receive a GIF message.

**Payload:**
```json
{
  "gifUrl": "string",
  "userName": "string",
  "userId": "string",
  "_id": "string",
  "timestamp": "date"
}
```

#### user-joined
Notification that a user has joined the room.

**Payload:**
```json
"string" // username
```

## CORS Policy

The API allows CORS requests from the frontend URL specified in the `FRONTEND_URL` environment variable.

## Versioning

This documentation covers API version 1.0. Future versions will be documented separately and may introduce breaking changes.

## Testing

For testing the API, you can use tools like:
- Postman
- curl
- Insomnia

Example curl request:
```bash
curl -X POST http://localhost:3000/api/auth/guest \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser"}'
