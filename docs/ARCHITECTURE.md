# System Architecture

Complete architecture documentation for Election Process Assistant.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├─────────────────────────────────────────────────────────────────┤
│  React App (Vite)  │  Tailwind CSS  │  i18n  │  Zustand Store  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ HTTP/REST (Axios)
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                      API Layer (Express)                         │
├─────────────────────────────────────────────────────────────────┤
│  Routes  │  Controllers  │  Middlewares  │  Validation          │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ MongoDB Protocol
               │
┌──────────────▼──────────────────────────────────────────────────┐
│                      Data Layer                                  │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB  │  Collections  │  Indexes  │  Replication            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI API  │  Authentication  │  Email  │  Maps               │
└─────────────────────────────────────────────────────────────────┘
```

## System Components

### 1. Client Layer (Frontend)

**Technology**: React 18 + Vite

**Components:**

- **Pages**: Individual page components (Home, Chat, Timeline, etc.)
- **Components**: Reusable UI components organized by type
- **Services**: API client layer for backend communication
- **State Management**: Zustand for global state
- **Context API**: For auth and theme
- **Hooks**: Custom React hooks for common logic
- **i18n**: Multi-language support

**Directory Structure:**

```
frontend/src/
├── components/       # UI components
├── pages/           # Page components
├── routes/          # Route configuration
├── services/        # API services
├── hooks/           # Custom hooks
├── context/         # Context providers
├── store/           # Zustand store
├── utils/           # Helper functions
├── i18n/            # Translations
└── styles/          # CSS files
```

### 2. API Layer (Backend)

**Technology**: Node.js + Express.js

**Architecture**: MVC with Services

**Request Flow:**

```
HTTP Request
    ↓
Router (Express)
    ↓
Middleware (Auth, Validation, Error Handling)
    ↓
Controller (Request Handler)
    ↓
Service (Business Logic)
    ↓
Model (Database Query)
    ↓
MongoDB
    ↓
Response (JSON)
```

**Components:**

- **Routes**: Define HTTP endpoints
- **Controllers**: Handle requests and responses
- **Services**: Business logic and external service integration
- **Models**: Mongoose schemas and database operations
- **Middlewares**:
  - Authentication (JWT)
  - Authorization (Role-based)
  - Validation
  - Error Handling
  - Logging
  - Rate Limiting
  - CORS

**Directory Structure:**

```
backend/src/
├── config/          # Configuration
├── controllers/     # Request handlers
├── routes/          # Route definitions
├── models/          # Database schemas
├── middlewares/     # Custom middlewares
├── services/        # Business logic
├── validations/     # Input validation
├── utils/           # Helper functions
├── constants/       # App constants
└── tests/           # Test files
```

### 3. Data Layer (Database)

**Technology**: MongoDB with Mongoose

**Collections:**

- **Users**: User profiles and credentials
- **Elections**: Election data and metadata
- **Timelines**: Election timeline events
- **FAQs**: Frequently asked questions
- **PollingBooths**: Voting center locations
- **Notifications**: User notifications
- **ConversationHistory**: Chat history

**Schema Design:**

```javascript
User {
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user|admin),
  preferences: {
    language: String,
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}

Election {
  _id: ObjectId,
  name: String,
  state: String,
  district: String,
  votingDate: Date,
  registrationDeadline: Date,
  resultDate: Date,
  status: String
}

PollingBooth {
  _id: ObjectId,
  name: String,
  address: String,
  state: String,
  district: String,
  location: {
    type: Point,
    coordinates: [longitude, latitude]
  },
  capacity: Number,
  votingHours: String,
  accessibility: Object
}
```

### 4. External Services

**OpenAI Integration:**

- Chat completion API for AI assistant
- Streaming responses
- Conversation history management

**Authentication:**

- JWT tokens
- Bcrypt password hashing

**Email Service:** (Optional)

- SendGrid / Nodemailer for notifications

**Geolocation:**

- Google Maps API for polling booth finder

## API Endpoints Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
├── /users
│   ├── GET /:id
│   ├── PUT /:id
│   └── DELETE /:id
├── /elections
│   ├── GET
│   ├── GET /:id
│   ├── POST (admin)
│   └── PUT /:id (admin)
├── /ai
│   ├── POST /chat
│   └── POST /ask
├── /timeline
│   ├── GET
│   └── GET /:id
└── /polling
    ├── GET /booths
    ├── GET /booths/:id
    └── POST /search
```

## Data Flow Examples

### Example 1: User Registration Flow

```
1. User fills form (Frontend)
   ↓
2. Frontend validates input
   ↓
3. POST /api/auth/register (with data)
   ↓
4. Backend validation middleware checks data
   ↓
5. Controller calls User Service
   ↓
6. Service hashes password (bcryptjs)
   ↓
7. Model creates user in MongoDB
   ↓
8. Service generates JWT token
   ↓
9. Response with token
   ↓
10. Frontend stores token (localStorage)
    ↓
11. Token used for future requests
```

### Example 2: AI Chat Flow

```
1. User types message (Frontend)
   ↓
2. POST /api/ai/chat {message, language, conversationId}
   ↓
3. Backend auth middleware verifies JWT
   ↓
4. Controller receives request
   ↓
5. AI Service calls OpenAI API
   ↓
6. AI Service translates to user's language (i18next)
   ↓
7. Service stores conversation in MongoDB
   ↓
8. Response with AI answer
   ↓
9. Frontend displays answer
   ↓
10. Store in conversation history
```

### Example 3: Polling Booth Search Flow

```
1. User enters location (Frontend)
   ↓
2. Frontend gets geolocation (browser API)
   ↓
3. POST /api/polling/search {lat, lng, radiusKm}
   ↓
4. Backend uses MongoDB geospatial query
   ↓
5. Query uses indexed location field (Point)
   ↓
6. Returns nearby polling booths
   ↓
7. Frontend displays on map
```

## Scalability Considerations

### Horizontal Scaling

- **Load Balancer**: Use Nginx/HAProxy to distribute traffic
- **Multiple Backend Instances**: Run multiple Node.js processes
- **Database Replication**: MongoDB replica set for data redundancy

### Vertical Scaling

- **Caching**: Redis for session and query caching
- **Indexing**: MongoDB indexes on frequently queried fields
- **Connection Pooling**: Mongoose connection pooling

### Performance Optimization

- **Frontend**:
  - Code splitting with Vite
  - Lazy loading of routes
  - Image optimization
  - CSS-in-JS minification

- **Backend**:
  - Query optimization with lean()
  - Pagination for large datasets
  - Caching with Redis
  - Compression middleware (gzip)

- **Database**:
  - Indexes on commonly queried fields
  - Data aggregation pipeline
  - Query profiling

## Security Architecture

```
┌─────────────────┐
│   Client        │
└────────┬────────┘
         │ HTTPS (TLS/SSL)
         ↓
┌─────────────────────────────────┐
│ API Gateway / Load Balancer     │
│ - SSL Termination               │
│ - Rate Limiting                 │
│ - CORS Validation               │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ Express Application              │
│ - Input Validation              │
│ - JWT Authentication            │
│ - Authorization (RBAC)          │
│ - Request Logging               │
│ - Error Handling                │
└────────┬────────────────────────┘
         ↓
┌─────────────────────────────────┐
│ MongoDB                         │
│ - Encrypted Connections         │
│ - User Authentication           │
│ - Replica Set                   │
└─────────────────────────────────┘
```

## Authentication Flow

```
1. User Login
   ↓
2. Password verified with bcrypt
   ↓
3. JWT token generated (include user ID, role)
   ↓
4. Token stored in frontend (httpOnly cookie or localStorage)
   ↓
5. Token sent with each request
   ↓
6. Middleware verifies JWT signature
   ↓
7. User context attached to request
   ↓
8. Controller processes authorized request
```

## Error Handling Strategy

```
┌──────────────────────────────┐
│ Error Occurs                 │
└──────────────┬───────────────┘
               ↓
       ┌───────────────┐
       │ Error Type?   │
       └───────┬───────┘
         ┌─────┴─────┐
         ↓           ↓
    Validation   Database
         ↓           ↓
    400 Error    500 Error
         ↓           ↓
      Log Error   Log Error
         ↓           ↓
   Return JSON   Return JSON
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Domain Registry             │
│      election-assistant.com         │
└──────────────┬──────────────────────┘
               ↓
        ┌──────────────┐
        │ CDN/CloudFront
        │ (Static Files)
        └──────┬───────┘
               ↓
       ┌───────────────────┐
       │ Web Server        │
       │ (Frontend - Vercel)
       └───────┬───────────┘
               ↓
        ┌──────────────────────────┐
        │ Load Balancer / API Gateway
        └──────┬───────────────────┘
               ↓
    ┌──────────┴──────────┐
    ↓                     ↓
┌────────┐          ┌────────┐
│Backend │          │Backend │
│Server 1│          │Server 2│
└────┬───┘          └────┬───┘
     │                   │
     └───────┬───────────┘
             ↓
        ┌─────────────┐
        │ MongoDB     │
        │ (Atlas/Self)
        └─────────────┘
```

## Technology Stack Summary

| Layer        | Technology     | Purpose          |
| ------------ | -------------- | ---------------- |
| **Frontend** | React 18, Vite | UI & UX          |
|              | Tailwind CSS   | Styling          |
|              | Axios          | HTTP Client      |
|              | i18next        | Translations     |
|              | Zustand        | State Management |
| **Backend**  | Node.js        | Runtime          |
|              | Express.js     | Web Framework    |
|              | Mongoose       | ODM              |
|              | JWT            | Authentication   |
|              | bcryptjs       | Password Hashing |
| **Database** | MongoDB        | Document DB      |
| **External** | OpenAI         | AI Chat          |
|              | JWT            | Auth Tokens      |
| **DevOps**   | Docker         | Containerization |
|              | GitHub Actions | CI/CD            |
|              | Vercel/Heroku  | Deployment       |

---

This architecture is designed to be scalable, secure, and maintainable while supporting the core functionality of the Election Process Assistant.

**Last Updated**: 2024-01-15
