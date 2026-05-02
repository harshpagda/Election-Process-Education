# Setup Guide

Complete setup instructions for Election Process Assistant.

## Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** 8+ (comes with Node.js)
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))
- **OpenAI API Key** ([Get here](https://platform.openai.com/api-keys))

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd election-process-assistant
```

## Step 2: Install Dependencies

### Install all dependencies (monorepo)

```bash
npm run install-all
```

Or install individually:

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Setup Environment Variables

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/election-process-assistant
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d
OPENAI_API_KEY=sk-xxxxxxxxxxxxxx
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Election Process Assistant
VITE_DEFAULT_LANGUAGE=en
```

## Step 4: Setup MongoDB

### Option A: Local MongoDB

```bash
# If MongoDB is installed locally
mongod

# Create database (optional, will auto-create on first connection)
# mongosh
# use election-process-assistant
```

### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `backend/.env`

## Step 5: Start Development Servers

### Option A: Start Both (Recommended)

```bash
npm run dev
```

This starts:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### Option B: Start Separately

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Step 6: Verify Setup

### Check Backend

```bash
curl http://localhost:5000/api/health
```

Expected response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Check Frontend

Open http://localhost:5173 in browser

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error

- Check MongoDB is running: `mongod --version`
- Verify connection string in `.env`
- Check database URL format

### Missing Dependencies

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Error

- Backend running on port 5000?
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

## Project Structure

After setup, your project should look like:

```
election-process-assistant/
├── backend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── ...
├── docs/
├── package.json
└── README.md
```

## Running Tests

```bash
npm test
```

## Building for Production

```bash
npm run build
```

Output:

- Backend: Ready to deploy
- Frontend: Built in `frontend/dist/`

## Next Steps

1. Read [API Documentation](./API.md)
2. Review [Architecture](./ARCHITECTURE.md)
3. Check feature documentation in README files
4. Start implementing features

## Support

For issues during setup:

1. Check error messages carefully
2. Review prerequisites
3. Check GitHub issues
4. Create new issue with error details

---

**Happy coding! 🚀**
