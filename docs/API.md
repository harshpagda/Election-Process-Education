# API Documentation

Complete REST API documentation for Election Process Assistant.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    "id": "user123",
    "name": "John Doe"
  }
}
```

### Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid request",
  "errors": []
}
```

## Endpoints

### Authentication

#### Register User

```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+91-9876543210"
}

Response: 201
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user123",
      "email": "john@example.com"
    }
  }
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 200
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": { ... }
  }
}
```

#### Logout

```
POST /auth/logout
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "message": "Logout successful"
}
```

### Users

#### Get User Profile

```
GET /users/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Update Profile

```
PUT /users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "phone": "+91-9876543210"
}

Response: 200
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Elections

#### Get All Elections

```
GET /elections
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [
    {
      "id": "election123",
      "name": "General Elections 2024",
      "state": "Maharashtra",
      "votingDate": "2024-04-19",
      "status": "active"
    }
  ]
}
```

#### Get Election Details

```
GET /elections/:id
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "id": "election123",
    "name": "General Elections 2024",
    "description": "...",
    "votingDate": "2024-04-19",
    "registrationDeadline": "2024-03-19",
    "status": "active"
  }
}
```

### AI Chat

#### Send Message

```
POST /ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I register to vote?",
  "language": "en",
  "conversationId": "conv123"
}

Response: 200
{
  "success": true,
  "data": {
    "response": "To register as a voter, you need to...",
    "conversationId": "conv123"
  }
}
```

### Timeline

#### Get Election Timeline

```
GET /timeline?electionId=election123
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": {
    "events": [
      {
        "date": "2024-03-19",
        "title": "Registration Deadline",
        "description": "Last day to register as voter"
      },
      {
        "date": "2024-04-19",
        "title": "Voting Day",
        "description": "General voting day"
      }
    ]
  }
}
```

### Polling Booths

#### Get All Polling Booths

```
GET /polling/booths?state=Maharashtra&district=Mumbai
Authorization: Bearer <token>

Response: 200
{
  "success": true,
  "data": [
    {
      "id": "booth123",
      "name": "Primary School A",
      "address": "123 Main St, Mumbai",
      "latitude": 19.0760,
      "longitude": 72.8777,
      "votingHours": "07:00-18:00"
    }
  ]
}
```

#### Search Nearby Booths

```
POST /polling/search
Authorization: Bearer <token>
Content-Type: application/json

{
  "latitude": 19.0760,
  "longitude": 72.8777,
  "radiusKm": 5
}

Response: 200
{
  "success": true,
  "data": {
    "booths": [
      {
        "id": "booth123",
        "name": "Primary School A",
        "distance": 1.2,
        "address": "..."
      }
    ]
  }
}
```

## Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Header**: `X-RateLimit-Remaining`

## Error Codes

| Code | Message         | Description            |
| ---- | --------------- | ---------------------- |
| 400  | Invalid request | Validation error       |
| 401  | Unauthorized    | Missing/invalid token  |
| 404  | Not found       | Resource doesn't exist |
| 500  | Server error    | Internal server error  |

## Example: Complete User Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Response includes token

# 2. Get Elections
curl -X GET http://localhost:5000/api/elections \
  -H "Authorization: Bearer <token>"

# 3. Chat with AI
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I vote?",
    "language": "en"
  }'
```

---

For more details, see individual endpoint documentation or contact support.
