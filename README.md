# 🗳️ Election Process Assistant

An AI-powered web application designed to simplify and clarify the election process for all citizens. Whether you're a first-time voter or just need guidance, our intelligent assistant breaks down complex election procedures into simple, understandable steps.

## 🎯 Problem We Solve

Citizens struggle to understand the election process due to:

- Complex legal language
- Scattered information
- Confusing timelines
- Lack of beginner-friendly guidance
- Language barriers
- Poor UX on existing platforms

## 💡 Solution

An intelligent AI assistant that:

- ✅ Explains elections in simple language
- 📋 Provides step-by-step guidance
- ⏱️ Shows clear timelines with reminders
- 🌍 Supports 6 languages
- 💬 Offers interactive chat & voice interface
- 📱 Works seamlessly on mobile
- 🧠 Uses AI to answer any election questions

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB
- OpenAI API Key

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd election-process-assistant

# Install all dependencies
npm run install-all

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env files with your configuration
```

### Running Development Servers

```bash
# Start both backend and frontend
npm run dev

# Backend will run on: http://localhost:5000
# Frontend will run on: http://localhost:5173
```

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
election-process-assistant/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── middlewares/  # Custom middleware
│   │   ├── services/     # Business logic
│   │   ├── validations/  # Input validation
│   │   └── utils/        # Helper functions
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/             # React + Vite UI
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── hooks/        # React hooks
│   │   ├── context/      # Context API
│   │   ├── store/        # State management
│   │   ├── i18n/         # Translations
│   │   ├── styles/       # Global styles
│   │   └── utils/        # Utilities
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── README.md
│
├── docs/                 # Documentation
│   ├── SETUP.md         # Setup guide
│   ├── API.md           # API documentation
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── ARCHITECTURE.md  # Architecture overview
│
├── .github/
│   └── workflows/       # CI/CD pipelines
│
├── package.json         # Monorepo root
└── README.md           # This file
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components
- **React Router** - Navigation
- **i18next** - Internationalization
- **Axios** - HTTP Client
- **Zustand** - State Management

### Backend

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **OpenAI API** - AI Integration
- **Helmet** - Security
- **CORS** - Cross-origin Support

### AI Integration

- **OpenAI GPT** - Chat Assistant

## 📱 Supported Languages

- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Malayalam (മലയാളം)

## ✨ Key Features

### 1. AI Chat Assistant

Ask anything about the election process and get instant, accurate answers in your language.

### 2. Step-by-Step Guide

Visual guide showing the complete election process:

- Voter Registration
- Eligibility Verification
- Voting Process
- Results & Counting

### 3. Election Timeline

Important dates tracker:

- Registration Deadline
- Voting Dates
- Results Declaration
- Reminders & Alerts

### 4. Eligibility Checker

Quick assessment tool:

- Age verification
- Citizenship check
- Voter ID verification
- Instant eligibility status

### 5. Polling Booth Finder

Location-based services:

- Find nearest polling booth
- Booth details & directions
- Opening hours
- Accessibility info

### 6. Multilingual Support

Interface available in 6 Indian languages with real-time translation.

### 7. Voice Assistant

Hands-free interaction for:

- Users with accessibility needs
- Mobile users
- Speech-to-text queries

### 8. Notifications

Smart reminders for:

- Registration deadlines
- Voting day reminders
- Election updates
- Important announcements

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcryptjs encryption
- **Role-Based Access** - Admin, User roles
- **Input Validation** - Prevent injection attacks
- **Rate Limiting** - Prevent abuse
- **CORS Protection** - Control API access
- **Helmet Headers** - Security headers
- **Environment Variables** - Sensitive data protection

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup & API
- [Frontend README](./frontend/README.md) - Frontend setup & features
- [Setup Guide](./docs/SETUP.md) - Complete setup instructions
- [API Documentation](./docs/API.md) - API endpoints & examples
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment
- [Architecture](./docs/ARCHITECTURE.md) - System architecture

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm test --workspace=backend
npm test --workspace=frontend
```

## 📊 Project Status

- ✅ Project Structure
- ✅ Configuration Setup
- ✅ Authentication & Security
- ⏳ API Implementation
- ⏳ Frontend Components
- ⏳ AI Integration
- ⏳ Testing & QA
- ⏳ Deployment

## 🤝 Contributing

This project was created for hackathon purposes but is designed to scale to production. Contributions are welcome!

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

**Harsh Pagda**

- GitHub: [@harshpagda](https://github.com/harshpagda)

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ to make democracy more accessible to everyone**
