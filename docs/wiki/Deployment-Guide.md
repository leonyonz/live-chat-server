# Production Deployment Guide

This guide explains how to deploy the Live Chat Server application in a production environment using Docker.

## Prerequisites

1. **Docker** and **Docker Compose** installed on the production server
2. **Domain name** configured to point to your server
3. **SSL certificate** (recommended for HTTPS)

## Production Deployment Steps

### 1. Environment Configuration

Create a production environment file:
```bash
cp .env.production .env
```

Edit the `.env` file to set secure values for:
- `MONGO_ROOT_PASSWORD`: Generate a strong password for MongoDB
- `JWT_SECRET`: Generate a strong secret for JWT tokens
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Your Google OAuth credentials
- `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`: Your Facebook App credentials
- `GIPHY_API_KEY`: Your Giphy API key
- `FRONTEND_URL`: Your production domain (e.g., https://chat.yourdomain.com)

### 2. Build and Deploy

Build and start the application in production mode:
```bash
docker-compose up --build -d
```

The `-d` flag runs the containers in detached mode (background).

### 3. Create Admin User

After the application is running, create an admin user:
```bash
docker-compose exec app node scripts/create-admin.js --username admin --email admin@yourdomain.com --password YOUR_SECURE_PASSWORD
```

### 4. Verify Deployment

Check that all services are running:
```bash
docker-compose ps
```

View logs if needed:
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs mongodb
```

## Production Best Practices

### Security Enhancements

1. **Firewall Configuration**: Only expose necessary ports (typically 80/443)
2. **Reverse Proxy**: Use nginx or Apache as a reverse proxy for SSL termination
3. **Regular Updates**: Keep Docker images updated
4. **Backup Strategy**: Regularly backup MongoDB data

### Performance Optimization

1. **Resource Limits**: Configure CPU/memory limits in docker-compose.yml
2. **Load Balancing**: For high traffic, use multiple app instances behind a load balancer
3. **Database Indexes**: Ensure proper indexes on MongoDB collections
4. **CDN**: Use a CDN for static assets

### Monitoring and Maintenance

1. **Health Checks**: The Dockerfile includes built-in health checks
2. **Log Management**: Implement log rotation to prevent disk space issues
3. **Automated Backups**: Schedule regular backups of MongoDB data
4. **Monitoring**: Implement application monitoring (e.g., Prometheus, Grafana)

## Scaling Options

### Horizontal Scaling

To run multiple app instances:
```yaml
# In docker-compose.yml, modify the app service:
app:
  build: 
    context: .
    dockerfile: Dockerfile
  deploy:
    replicas: 3  # Run 3 instances
  # ... rest of configuration
```

Note: For true horizontal scaling with session sharing, you'll need to implement Redis for session storage.

### Vertical Scaling

Increase resources allocated to containers by modifying docker-compose.yml:
```yaml
app:
  # ... other configuration
  deploy:
    resources:
      limits:
        cpus: '0.5'
        memory: 512M
      reservations:
        cpus: '0.25'
        memory: 256M
```

## Backup and Restore

### MongoDB Backup

Create a backup of the MongoDB database:
```bash
docker-compose exec mongodb mongodump --username admin --password YOUR_MONGO_PASSWORD --authenticationDatabase admin --out /data/db/backups/$(date +%Y%m%d_%H%M%S)
```

### MongoDB Restore

Restore from a backup:
```bash
docker-compose exec mongodb mongorestore --username admin --password YOUR_MONGO_PASSWORD --authenticationDatabase admin /data/db/backups/BACKUP_FOLDER_NAME
```

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure Docker is running with appropriate permissions
2. **Port Conflicts**: Check that ports 3000 and 27017 are not in use
3. **Environment Variables**: Verify all required environment variables are set
4. **Network Issues**: Ensure containers can communicate (especially app to mongodb)

### Useful Commands

```bash
# Restart services
docker-compose restart

# Stop services
docker-compose down

# View resource usage
docker stats

# Execute commands in running container
docker-compose exec app bash

# Update and restart
docker-compose down
docker-compose up --build -d
```

## Migration from Development

If migrating from a development deployment:

1. Update environment variables in `.env` file
2. Ensure production dependencies are installed
3. Test the deployment in a staging environment first
4. Update any hardcoded URLs in the frontend code

## SSL Configuration

For HTTPS, we recommend using a reverse proxy like nginx with Let's Encrypt:

1. Install nginx on your server
2. Obtain SSL certificate using Certbot:
   ```bash
   sudo certbot --nginx -d chat.yourdomain.com
   ```
3. Configure nginx to proxy requests to your Docker containers

Sample nginx configuration:
```nginx
server {
    listen 80;
    server_name chat.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name chat.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/chat.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chat.yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
