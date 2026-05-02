# Deployment Guide

Complete guide for deploying Election Process Assistant to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] API keys secured
- [ ] Security headers configured
- [ ] CORS settings updated
- [ ] SSL/TLS certificates ready

## Backend Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create election-assistant-backend

# Set environment variables
heroku config:set NODE_ENV=production \
  MONGODB_URI=<production-db-url> \
  JWT_SECRET=<secure-secret> \
  OPENAI_API_KEY=<api-key>

# Deploy
git push heroku main
```

### Option 2: AWS EC2

```bash
# Connect to instance
ssh -i key.pem ubuntu@<instance-ip>

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <repo-url>
cd election-process-assistant/backend

# Install dependencies
npm install

# Set environment variables
export NODE_ENV=production
export MONGODB_URI=<db-url>
# ... other variables

# Start with PM2
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

### Option 3: DigitalOcean App Platform

```bash
# Push to GitHub
git push origin main

# In DigitalOcean Dashboard:
# 1. Click "Create" > "App"
# 2. Connect GitHub repository
# 3. Configure backend directory
# 4. Set environment variables
# 5. Deploy
```

### Option 4: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```bash
# Build image
docker build -t election-assistant-backend .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=<db-url> \
  election-assistant-backend
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
VITE_API_URL=<production-api-url>
```

### Option 2: Netlify

```bash
# Build frontend
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

```bash
# Configure vite.config.js
export default {
  base: '/election-assistant/',
  // ... rest of config
}

# Build and deploy
npm run build
# Push to gh-pages branch
```

### Option 4: AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://election-assistant

# Upload files
aws s3 sync dist/ s3://election-assistant

# Create CloudFront distribution (optional but recommended)
```

## Database Deployment

### MongoDB Atlas (Recommended)

```bash
# Create account at mongodb.com/cloud/atlas
# 1. Create cluster
# 2. Create database user
# 3. Whitelist IP addresses
# 4. Get connection string
# 5. Use as MONGODB_URI
```

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable on startup
sudo systemctl enable mongod

# Create admin user
mongosh
db.createUser({
  user: "admin",
  pwd: "secure-password",
  roles: ["root"]
})
```

## Environment Configuration

### Production .env

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<long-random-secret>
JWT_EXPIRY=30d
OPENAI_API_KEY=<api-key>
CLIENT_URL=https://election-assistant.com
CORS_ORIGIN=https://election-assistant.com
```

## SSL/TLS Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d election-assistant.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## Monitoring & Logging

### PM2 Monitoring

```bash
pm2 install pm2-logrotate
pm2 logs
pm2 monit
```

### Application Insights

```bash
# For Node.js apps
npm install applicationinsights

# Initialize in app.js
const appInsights = require("applicationinsights");
appInsights.setup();
```

### CloudWatch (AWS)

```bash
# Install agent
sudo apt-get install amazon-cloudwatch-agent

# Configure logs
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json
```

## Security Hardening

### HTTPS Redirect

```javascript
// In Express app.js
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

### Security Headers

```javascript
const helmet = require("helmet");
app.use(helmet());
```

### Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
```

## Performance Optimization

### Frontend

```bash
# Analyze bundle
npm run build -- --analyze

# Minification is automatic with Vite
# Enable gzip compression in server
```

### Backend

```bash
# Use clustering
npm install cluster

# Implement caching
npm install redis
```

## Health Checks

### Backend Health Check

```bash
curl https://api.election-assistant.com/api/health
```

### Monitoring Service

```bash
# Using UptimeRobot or similar
GET /api/health every 5 minutes
```

## Backup & Disaster Recovery

### MongoDB Backup

```bash
# Backup
mongodump --uri="<connection-string>" --archive=backup.archive

# Restore
mongorestore --archive=backup.archive
```

### Database Replication

```bash
# Enable MongoDB Atlas automated backups
# Or setup MongoDB replica set
```

## Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Database backups confirmed
- [ ] SSL certificate installed
- [ ] CORS configured for production domain
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Backup restoration tested
- [ ] Performance baseline established

## Post-Deployment

1. Monitor application
2. Check error logs
3. Verify database connectivity
4. Test critical user flows
5. Monitor performance metrics
6. Plan backup schedule

## Troubleshooting

### Application won't start

```bash
# Check logs
pm2 logs
journalctl -u mongod -n 50

# Verify environment variables
env | grep NODE_ENV
```

### Database connection issues

```bash
# Test connection
mongosh "<connection-string>"

# Check IP whitelist in MongoDB Atlas
```

### CORS errors

```bash
# Update CORS in backend
cors({
  origin: 'https://frontend-domain.com',
  credentials: true
})
```

---

For production support, contact deployment team.

**Last Updated**: 2024-01-15
