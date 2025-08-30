import React from 'react';
import { Link } from 'react-router-dom';
import mindeaseLogo from '../assets/mindease-logo.svg';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border-b border-white/20 dark:border-neutral-700/50 shadow-soft">
      <div className="flex justify-between items-center h-16 px-6">
        {/* Logo and App Name */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img src={mindeaseLogo} alt="MindHaven Logo" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              MindHaven
            </span>
          </Link>
        </div>

        {/* Right Side - Dashboard Link */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="btn btn-primary px-6 py-2 text-sm font-semibold shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 