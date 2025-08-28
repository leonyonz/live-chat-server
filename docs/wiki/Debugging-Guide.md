# Debugging Guide

This application includes a built-in debugging system that allows you to control the verbosity of logs in both the client-side and server-side components.

## How It Works

The debugging system is controlled by the `DEBUG_ENABLED` environment variable in the `.env` file. When set to `true`, debug messages will be logged to the console. When set to `false`, debug messages will be suppressed.

## Configuration

### Server-Side Debugging

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

### Client-Side Debugging

Client-side debugging can be controlled in two ways:

1. **Environment Variable**: The client checks the `DEBUG_ENABLED` variable from the server's `.env` file.
2. **URL Parameter**: You can override the debugging setting by adding `?debug=true` or `?debug=false` to the URL.

For example:
- `http://localhost:3000/?debug=true` - Enables debugging
- `http://localhost:3000/?debug=false` - Disables debugging (even if `DEBUG_ENABLED=true` in .env)

## Usage

### Enabling Debug Mode

1. Set `DEBUG_ENABLED=true` in your `.env` file
2. Restart the server
3. Open the application in your browser
4. Open the browser's developer console to view the logs

### Disabling Debug Mode

1. Set `DEBUG_ENABLED=false` in your `.env` file
2. Restart the server
3. The console logs will be suppressed

Alternatively, you can temporarily disable debugging for a specific session by adding `?debug=false` to the URL.

## Debug Output Format

Debug messages are prefixed to distinguish them from other console output:

- **Client-side**: `[LiveChat Debug]`
- **Admin panel**: `[LiveChat Admin Debug]`
- **Server-side**: `[Server Debug]`

## Example Debug Messages

Client-side:
```
[LiveChat Debug] Attempting to connect to Socket.IO server
[LiveChat Debug] Socket connected successfully, socket ID: abc123
```

Server-side:
```
[Server Debug] User connected: abc123
[Server Debug] User john_doe (12345) joining room: general
```

## Best Practices

1. **Development**: Keep `DEBUG_ENABLED=true` during development to get detailed information about the application's behavior.
2. **Production**: Set `DEBUG_ENABLED=false` in production to reduce console clutter and improve performance.
3. **Troubleshooting**: Temporarily enable debugging in production by adding `?debug=true` to the URL when troubleshooting issues.

## Server-Side Debugging Details

The server-side debugging system provides detailed information about:

### Socket.IO Events
- Connection and disconnection events
- Room join and leave events
- Message broadcasting

### Database Operations
- User creation and authentication
- Room creation and management
- Message storage and retrieval

### Error Conditions
- Database connection issues
- Authentication failures
- Invalid requests

## Client-Side Debugging Details

The client-side debugging system provides information about:

### Connection Status
- Socket.IO connection attempts
- Connection success or failure
- Reconnection events

### User Interface Events
- Chat bubble interactions
- Message sending and receiving
- Room switching

### API Calls
- Authentication requests
- Giphy API calls
- Message history requests

## Admin Panel Debugging

The admin panel has its own debugging system that provides information about:

### User Management
- User list loading
- Role changes
- User deletions

### Room Management
- Room list loading
- Room deletions

### Message Moderation
- Message list loading
- Message deletions

## Troubleshooting with Debug Logs

When troubleshooting issues, enable debugging and look for:

1. **Connection Issues**: Check for Socket.IO connection errors
2. **Authentication Problems**: Look for authentication failure messages
3. **Database Errors**: Check for MongoDB connection or query errors
4. **Message Delivery**: Verify message sending and receiving logs
5. **API Failures**: Look for Giphy API or other external service errors

## Performance Impact

Enabling debug mode has a slight performance impact due to:

1. Additional console output
2. Extra string processing for debug messages
3. Increased log volume

In production environments, it's recommended to disable debug mode to minimize this impact.

## Security Considerations

Debug logs may contain sensitive information such as:

- User IDs
- Room names
- Message content
- API keys (if accidentally logged)

Ensure that debug logs are not accessible to unauthorized users, especially in production environments.

## Customizing Debug Output

Developers can add custom debug messages to the application by using the debug functions:

### Server-Side
```javascript
// In server code
function debugLog(...args) {
  if (process.env.DEBUG_ENABLED === 'true') {
    console.log('[Server Debug]', ...args);
  }
}

function debugError(...args) {
  if (process.env.DEBUG_ENABLED === 'true') {
    console.error('[Server Debug]', ...args);
  }
}
```

### Client-Side
```javascript
// In client code
function debugLog(...args) {
  const urlParams = new URLSearchParams(window.location.search);
  const debugEnabled = urlParams.get('debug') === 'true' || 
                      (window.debugEnabled && urlParams.get('debug') !== 'false');
  
  if (debugEnabled) {
    console.log('[LiveChat Debug]', ...args);
  }
}
```

## Log Management

In production environments with debug enabled, consider implementing log rotation to prevent disk space issues:

1. Use a log management service
2. Implement log rotation on the server
3. Set up alerts for critical errors
4. Regularly review and archive old logs

## Advanced Debugging Techniques

### Filtering Debug Output

Use the browser's console filters to focus on specific types of debug messages:

1. Filter by `[LiveChat Debug]` for client-side messages
2. Filter by `[Server Debug]` for server-side messages
3. Use regex filters for more complex patterns

### Remote Debugging

For debugging in remote environments:

1. Use centralized logging solutions
2. Implement structured logging formats
3. Add request tracing identifiers
4. Use logging levels (debug, info, warn, error)

## Common Debugging Scenarios

### Users Can't Connect to Chat

1. Enable debug mode
2. Check for Socket.IO connection errors
3. Verify the server is running and accessible
4. Check firewall and network settings

### Messages Not Appearing

1. Enable debug mode on both client and server
2. Check message sending logs on the client
3. Verify message receipt logs on the server
4. Check message broadcasting logs
5. Verify message display on recipient clients

### Authentication Failures

1. Enable debug mode
2. Check authentication request logs
3. Verify token generation and validation
4. Check user database queries

### Giphy Integration Issues

1. Enable debug mode
2. Check Giphy API request logs
3. Verify API key configuration
4. Check response handling

## Disabling Debug in Production

Before deploying to production:

1. Set `DEBUG_ENABLED=false` in the `.env` file
2. Verify that no sensitive information is logged
3. Test the application to ensure normal operation
4. Monitor logs for any unexpected errors
