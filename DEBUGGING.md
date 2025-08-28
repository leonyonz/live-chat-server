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
