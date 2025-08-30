import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Chatbot from './components/Chatbot';

// Pages
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import MoodTracker from './pages/MoodTracker';
import Activities from './pages/Activities';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Review from './pages/Review';
import Awareness from './pages/Awareness';
import JoyCorner from './pages/JoyCorner';
import Home from './pages/Home';

const AppContent: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          
          {/* App Routes - Temporarily bypassed authentication */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/journal" element={<Layout><Journal /></Layout>} />
          <Route path="/mood" element={<Layout><MoodTracker /></Layout>} />
          <Route path="/activities" element={<Layout><Activities /></Layout>} />
          <Route path="/progress" element={<Layout><Progress /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/review" element={<Layout><Review /></Layout>} />
          <Route path="/awareness" element={<Layout><Awareness /></Layout>} />
          <Route path="/joy-corner" element={<Layout><JoyCorner /></Layout>} />
          
          {/* Redirect all other routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      
      {/* Chatbot as a fixed component */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        <Chatbot />
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
