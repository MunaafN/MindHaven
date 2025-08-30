import React, { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBook, FiActivity, FiSmile, FiStar, FiSun, FiBarChart2, FiMenu, FiSettings, FiClipboard } from 'react-icons/fi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
  { to: '/journal', label: 'Journal', icon: <FiBook className="w-5 h-5" /> },
  { to: '/mood', label: 'Mood', icon: <FiSmile className="w-5 h-5" /> },
  { to: '/activities', label: 'Activities', icon: <FiActivity className="w-5 h-5" /> },
  { to: '/progress', label: 'Progress', icon: <FiBarChart2 className="w-5 h-5" /> },
  { to: '/review', label: 'Review', icon: <FiClipboard className="w-5 h-5" /> },
  { to: '/joy-corner', label: 'JoyCorner', icon: <FiStar className="w-5 h-5" /> },
  { to: '/awareness', label: 'Awareness', icon: <FiSun className="w-5 h-5" /> },
  { to: '/settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" /> },
];

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950">
      {/* Modern Sidebar */}
      <aside className={`relative bg-white/80 dark:bg-neutral-800/80 backdrop-blur-xl border-r border-white/20 dark:border-neutral-700/50 pt-0 px-3 flex flex-col gap-3 transition-all duration-500 ease-out ${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen shadow-soft`}>
        {/* Hamburger Button */}
        <div className="flex items-center justify-start mb-3 px-2 mt-2">
          <button
            className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 hover:scale-110 focus-ring"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <FiMenu className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 overflow-y-auto mt-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive ? 'nav-link-active' : ''} group`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20' : 'group-hover:bg-neutral-100 dark:group-hover:bg-neutral-700'}`}>
                  {React.cloneElement(link.icon, {
                    className: `w-5 h-5 transition-all duration-300 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'}`
                  })}
                </div>
                {sidebarOpen && (
                  <span className={`font-medium transition-all duration-300 ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100'}`}>
                    {link.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle Indicator */}
        {!sidebarOpen && (
          <div className="mt-auto mb-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-200 dark:border-primary-800 flex items-center justify-center">
              <FiMenu className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-8 min-h-screen overflow-y-auto">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout; 