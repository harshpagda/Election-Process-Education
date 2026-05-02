#!/bin/bash

echo "🗳️  Installing new dependencies for map features..."
echo ""

# Install frontend dependencies
cd frontend

echo "Installing Leaflet and React-Leaflet..."
npm install leaflet react-leaflet

echo ""
echo "✅ Installation complete!"
echo ""
echo "New Features:"
echo "- 📍 Interactive polling booth map"
echo "- 🔴 Live election announcements"
echo "- ⏱️ Election timeline tracking"
echo "- 📱 Geolocation-based booth finder"
echo ""
echo "Try these routes:"
echo "- http://localhost:5173/live-elections"
echo "- http://localhost:5173/polling-booths (when logged in)"
echo ""
echo "Getting started:"
echo "1. npm run dev"
echo "2. Login to access new features"
echo "3. Check dashboard for live election announcements"
