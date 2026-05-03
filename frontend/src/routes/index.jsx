import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '../store';
import AppLayout from '../components/layout/AppLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Chat from '../pages/Chat';
import FAQ from '../pages/FAQ';
import Elections from '../pages/Elections';
import LiveElections from '../pages/LiveElections';
import PollingBooths from '../pages/PollingBooths';
import Vote from '../pages/Vote';
import AdminDashboard from '../pages/AdminDashboard';

// Components
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <Router>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/live-elections" element={<LiveElections />} />
          <Route
            path="/polling-booths"
            element={
              <ProtectedRoute>
                <PollingBooths />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vote"
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
