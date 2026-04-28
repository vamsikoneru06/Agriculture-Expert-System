import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

const Login        = React.lazy(() => import('./pages/Login'));
const Register     = React.lazy(() => import('./pages/Register'));
const Dashboard    = React.lazy(() => import('./pages/Dashboard'));
const ExpertSystem = React.lazy(() => import('./pages/ExpertSystem'));
const Simulation   = React.lazy(() => import('./pages/Simulation'));
const MLPrediction = React.lazy(() => import('./pages/MLPrediction'));
const AdminPanel   = React.lazy(() => import('./pages/AdminPanel'));
const History      = React.lazy(() => import('./pages/History'));
const Chatbot      = React.lazy(() => import('./pages/Chatbot'));

function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f7faf7] dark:bg-[#060b06] transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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
        <div className="w-10 h-10 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Loading…</p>
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
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                <Route path="/dashboard"  element={<Dashboard />} />
                <Route path="/expert"     element={<ExpertSystem />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/ml"         element={<MLPrediction />} />
                <Route path="/history"    element={<History />} />
                <Route path="/chatbot"    element={<Chatbot />} />
                <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminPanel /></ProtectedRoute>} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
