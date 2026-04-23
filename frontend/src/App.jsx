import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

/* Lazy-loaded pages */
const Login       = React.lazy(() => import('./pages/Login'));
const Register    = React.lazy(() => import('./pages/Register'));
const Dashboard   = React.lazy(() => import('./pages/Dashboard'));
const ExpertSystem= React.lazy(() => import('./pages/ExpertSystem'));
const Simulation  = React.lazy(() => import('./pages/Simulation'));
const MLPrediction= React.lazy(() => import('./pages/MLPrediction'));
const AdminPanel  = React.lazy(() => import('./pages/AdminPanel'));
const History     = React.lazy(() => import('./pages/History'));
const Chatbot     = React.lazy(() => import('./pages/Chatbot'));

/* Shared authenticated layout */
function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <React.Suspense fallback={<PageLoader />}>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-64">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <React.Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes – shared layout */}
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard"  element={<Dashboard />} />
                <Route path="/expert"     element={<ExpertSystem />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/ml"         element={<MLPrediction />} />
                <Route path="/history"    element={<History />} />
                <Route path="/chatbot"    element={<Chatbot />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
