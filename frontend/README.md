# Election Process Assistant - Frontend

React + Vite frontend for the AI-powered Election Process Assistant.

## Features

- AI Chat Assistant
- Election Timeline Tracker
- Eligibility Checker
- Polling Booth Finder
- Step-by-Step Guide
- Multi-language Support (6 languages)
- Responsive Design
- Voice Assistant Support

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

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

**Production Build:**

```bash
npm run build
npm run preview
```

## Supported Languages

- English (en)
- Hindi (hi)
- Telugu (te)
- Tamil (ta)
- Kannada (kn)
- Malayalam (ml)

## Project Structure

```
src/
├── components/    # Reusable components
├── pages/         # Page components
├── routes/        # Route configuration
├── services/      # API services
├── hooks/         # Custom React hooks
├── context/       # React context
├── store/         # State management
├── utils/         # Utility functions
├── constants/     # App constants
├── i18n/          # Internationalization
├── styles/        # Global styles
├── assets/        # Static assets
└── tests/         # Test files
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technologies

- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **i18next** - Internationalization
- **Axios** - HTTP Client
- **Zustand** - State Management

## API Integration

Frontend communicates with backend at:

```
VITE_API_URL=http://localhost:5000/api
```

## Features Documentation

### AI Chat

- Real-time chat with AI assistant
- Ask about election process
- Get instant answers in your language

### Timeline Tracker

- View important election dates
- Countdown to election day
- Timeline of election process

### Eligibility Checker

- Check if you're eligible to vote
- Simple questionnaire
- Instant results

### Polling Booth Finder

- Find nearest polling booth
- Location-based search
- Booth details and directions

## Deployment

See `../docs/DEPLOYMENT.md` for deployment instructions.

## Contributing

Follow the project's code style and create meaningful commits.

## License

MIT
