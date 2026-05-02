#!/bin/bash

echo "🗳️  Installing dependencies..."
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy environment files:"
echo "   cp backend/.env.example backend/.env"
echo "   cp frontend/.env.example frontend/.env.local"
echo ""
echo "2. Update .env files with your configuration"
echo ""
echo "3. Start the application:"
echo "   Backend:  cd backend && npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker:"
echo "   docker-compose up"
