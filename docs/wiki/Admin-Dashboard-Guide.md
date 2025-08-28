# Admin Dashboard Guide

The Live Chat Server includes a comprehensive admin dashboard that allows administrators to manage users, rooms, and messages. This guide provides detailed information on how to use the admin dashboard effectively.

## Accessing the Admin Dashboard

To access the admin dashboard:

1. First, you need to create an admin user (see [Creating Admin Users](Creating-Admin-Users.md))
2. Navigate to `http://your-domain.com/admin` (replace with your actual domain)
3. Log in with your admin credentials

## Admin Dashboard Overview

The admin dashboard consists of several sections:

1. **Dashboard** - Overview statistics and recent activity
2. **Users** - User management interface
3. **Rooms** - Chat room management
4. **Messages** - Message moderation tools

Each section provides specific tools for managing different aspects of the chat system.

## Dashboard Section

The dashboard provides an overview of the system's current state:

- Total number of users
- Total number of chat rooms
- Total number of messages
- Recent activity feed showing latest user registrations, room creations, and messages

This overview helps administrators quickly understand the scale and activity level of their chat system.

## User Management

The user management section allows administrators to:

### View Users

- See a paginated list of all registered users
- View user details including:
  - Username
  - Email address
  - Registration date
  - Last login time
  - User role (user or admin)
  - Account status (active or disabled)

### Promote/Demote Users

Administrators can change a user's role:
- Promote a regular user to admin
- Demote an admin to regular user

To change a user's role:
1. Find the user in the list
2. Click the "Edit" button next to their name
3. Select the desired role from the dropdown
4. Click "Save Changes"

### Delete Users

Administrators can remove users from the system:
1. Find the user in the list
2. Click the "Delete" button next to their name
3. Confirm the deletion in the popup dialog

Note: Deleting a user will remove their account but not their messages or room memberships.

### Search and Filter

The user management interface includes search and filtering capabilities:
- Search by username or email
- Filter by user role (all, users, admins)
- Filter by account status (all, active, disabled)

## Room Management

The room management section allows administrators to:

### View Rooms

- See a list of all chat rooms
- View room details including:
  - Room name
  - Creator
  - Creation date
  - Number of members
  - Number of messages

### Delete Rooms

Administrators can remove chat rooms:
1. Find the room in the list
2. Click the "Delete" button next to the room
3. Confirm the deletion in the popup dialog

Note: Deleting a room will remove the room and all associated messages.

### Search and Filter

The room management interface includes search capabilities:
- Search by room name

## Message Moderation

The message moderation section allows administrators to:

### View Messages

- See a paginated list of all messages
- View message details including:
  - Message content
  - Sender
  - Room
  - Timestamp

### Delete Messages

Administrators can remove individual messages:
1. Find the message in the list
2. Click the "Delete" button next to the message
3. Confirm the deletion in the popup dialog

### Search and Filter

The message moderation interface includes search and filtering capabilities:
- Search by message content
- Filter by room
- Filter by user

## Security Features

The admin dashboard implements several security measures:

1. **Authentication Required** - All admin functions require valid login
2. **Role-Based Access Control** - Only users with admin role can access the dashboard
3. **Session Management** - Admin sessions expire after a period of inactivity
4. **Audit Trail** - Administrative actions are logged for security review

## Best Practices

### User Management

- Regularly review the user list to identify inactive accounts
- Only grant admin privileges to trusted individuals
- Remove admin privileges from users who no longer need them

### Room Management

- Monitor room creation to prevent spam or inappropriate content
- Remove rooms that violate community guidelines
- Consider archiving rather than deleting popular rooms with historical value

### Message Moderation

- Establish clear community guidelines for appropriate chat behavior
- Respond quickly to reports of abusive or inappropriate messages
- Use consistent criteria when moderating content

## Troubleshooting

### Cannot Access Admin Dashboard

1. Verify you have created an admin user
2. Check that you are using the correct URL
3. Ensure your credentials are correct
4. Check that the server is running properly

### Permission Denied Errors

1. Verify your user account has admin privileges
2. Try logging out and logging back in
3. Contact another administrator if you believe your privileges are incorrect

### Performance Issues

1. For installations with many users/rooms/messages, consider implementing pagination limits
2. Use search and filtering to narrow down results rather than browsing long lists
3. For very large installations, consider implementing database indexing

## Customization

The admin dashboard can be customized by modifying the files in the `public/admin/` directory:

- `admin.html` - Main dashboard layout
- `admin.css` - Styling
- `admin.js` - Client-side functionality

When customizing the admin interface, be careful to maintain the security features and API integrations.

## API Integration

The admin dashboard communicates with the server through a REST API. All admin endpoints are protected and require valid JWT authentication tokens.

For detailed information about the admin API, see the [API Documentation](API-Documentation.md).

## Reporting Issues

If you encounter bugs or issues with the admin dashboard:

1. Check the browser console for JavaScript errors
2. Check the server logs for backend errors
3. Verify your environment configuration
4. If the issue persists, submit a bug report to the project's GitHub issues page
