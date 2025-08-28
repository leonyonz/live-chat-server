# Configuration Guide

This guide explains all the configuration options available for the Live Chat Server application. Configuration is managed through environment variables defined in a `.env` file.

## Environment File Setup

To configure the application, create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Then edit the `.env` file to set your specific configuration values.

## Required Configuration Variables

### Server Configuration

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `PORT` | Port on which the server will listen | `3000` | No |
| `NODE_ENV` | Environment mode (development/production) | `development` | No |

### MongoDB Configuration

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/livechat` | Yes |

### JWT Configuration

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `JWT_SECRET` | Secret key for JWT token signing | (none) | Yes |

### Giphy API Configuration

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `GIPHY_API_KEY` | API key for Giphy integration | (none) | Yes |

### Frontend URL

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `FRONTEND_URL` | URL of the frontend application | `http://localhost:3000` | No |

## Optional Configuration Variables

### Google OAuth Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | No |

### Facebook OAuth Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `FACEBOOK_APP_ID` | Facebook App ID | No |
| `FACEBOOK_APP_SECRET` | Facebook App secret | No |
| `FACEBOOK_CALLBACK_URL` | Facebook OAuth callback URL | No |

### Debug Configuration

| Variable | Description | Default Value | Required |
|----------|-------------|---------------|----------|
| `DEBUG_ENABLED` | Enable/disable debug logging | `true` | No |

## Detailed Configuration Instructions

### MongoDB Configuration

The `MONGODB_URI` variable should contain a valid MongoDB connection string in the format:

```
mongodb://[username:password@]host[:port]/database[?options]
```

Examples:
- Local development: `mongodb://localhost:27017/livechat`
- Docker setup: `mongodb://admin:password@mongodb:27017/livechat?authSource=admin`
- Production with MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database`

### JWT Secret

The `JWT_SECRET` should be a long, random string used to sign JWT tokens. You can generate one using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Giphy API Key

To obtain a Giphy API key:

1. Visit [developers.giphy.com](https://developers.giphy.com/)
2. Create an account or log in
3. Create a new app
4. Copy the API key provided

### OAuth Configuration

#### Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/google/callback` (adjust for your domain)
6. Copy the Client ID and Client Secret to your `.env` file

#### Facebook OAuth

1. Go to the [Facebook Developers](https://developers.facebook.com/) site
2. Create a new app or select an existing one
3. Add the Facebook Login product
4. Set the valid OAuth redirect URI to: `http://localhost:3000/api/auth/facebook/callback` (adjust for your domain)
5. Copy the App ID and App Secret to your `.env` file

## Environment-Specific Configuration

### Development Environment

For development, your `.env` file might look like:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://admin:password@localhost:27017/livechat?authSource=admin

# JWT Configuration
JWT_SECRET=your_development_jwt_secret_here

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Facebook OAuth Configuration (optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/auth/facebook/callback

# Giphy API Configuration
GIPHY_API_KEY=your_giphy_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Debug Configuration
DEBUG_ENABLED=true
```

### Production Environment

For production, your `.env` file should have more secure settings:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/livechat?authSource=admin

# JWT Configuration
JWT_SECRET=your_production_jwt_secret_here

# Google OAuth Configuration (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Facebook OAuth Configuration (optional)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/auth/facebook/callback

# Giphy API Configuration
GIPHY_API_KEY=your_giphy_api_key

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Debug Configuration
DEBUG_ENABLED=false
```

## Docker Configuration

When using Docker, you can also pass environment variables through the `docker-compose.yml` file or by using environment files with the `--env-file` option.

Example docker-compose environment configuration:

```yaml
services:
  app:
    # ... other configuration
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password@mongodb:27017/livechat?authSource=admin
      - JWT_SECRET=your_jwt_secret
      - GIPHY_API_KEY=your_giphy_api_key
```

## Security Considerations

1. **Never commit `.env` files** to version control. The `.env` file is included in `.gitignore` by default.

2. **Use strong secrets** for JWT and database passwords in production.

3. **Limit environment variable exposure** in production environments.

4. **Use different credentials** for development and production environments.

5. **Regularly rotate secrets** in production environments.

## Validation

The application validates required environment variables at startup. If any required variables are missing, the application will fail to start with an error message indicating which variables are missing.

## Troubleshooting

### Environment Variables Not Taking Effect

1. Ensure the `.env` file is in the root directory
2. Verify there are no syntax errors in the `.env` file
3. Restart the application after making changes
4. When using Docker, rebuild the containers if necessary:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Invalid MongoDB URI

1. Check the format of your MongoDB connection string
2. Verify the username and password are correct
3. Ensure the MongoDB server is accessible
4. Check that the database name is correct

### Missing Giphy API Key

1. Verify you have obtained a Giphy API key
2. Check that the key is correctly copied to your `.env` file
3. Ensure there are no extra spaces or characters in the key

## Advanced Configuration

### Customizing Logging

The `DEBUG_ENABLED` variable controls whether debug messages are logged. In production, it's recommended to set this to `false` to reduce log volume and improve performance.

### Multiple Environment Files

You can maintain separate environment files for different environments:

- `.env.development` for development
- `.env.staging` for staging
- `.env.production` for production

Specify which file to use when starting the application:

```bash
# For development
node -r dotenv/config server.js dotenv_config_path=.env.development

# For production
node -r dotenv/config server.js dotenv_config_path=.env.production
