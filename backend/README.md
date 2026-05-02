# Election Process Assistant - Backend

Node.js + Express backend for the AI-powered Election Process Assistant.

## Features

- JWT Authentication
- Role-based Access Control
- AI Chat Integration (OpenAI)
- MongoDB Database
- Security: Helmet, CORS, Rate Limiting
- Input Validation
- Error Handling

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB
- OpenAI API Key

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete account

### Elections

- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get election details
- `POST /api/elections` - Create election (admin)

### AI Chat

- `POST /api/ai/chat` - Chat with AI assistant

### Timeline

- `GET /api/timeline` - Get election timeline

### Polling

- `GET /api/polling/booths` - Get polling booths
- `POST /api/polling/search` - Search nearby booths

## Folder Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── routes/         # Route definitions
├── models/         # Database models
├── middlewares/    # Custom middlewares
├── services/       # Business logic
├── validations/    # Input validation
├── utils/          # Helper functions
├── constants/      # App constants
└── tests/          # Test files
```

## Environment Variables

See `.env.example` for all available variables.

## Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Rate limiting enabled
- CORS configured
- Helmet headers enabled
- Input validation required

## Testing

```bash
npm test
npm run test:watch
```

## Deployment

See `../docs/DEPLOYMENT.md` for deployment instructions.
