import React, { useState, useEffect } from 'react';
import { FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAppSelector } from '../store/hooks';
import axiosInstance from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, token } = useAppSelector(state => state.auth);
  const [settings, setSettings] = useState({
    darkMode: document.documentElement.classList.contains('dark'),
    notifications: true,
    emailNotifications: true,
    reminderTime: '09:00',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<{[key:string]:boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const headers: any = {};
        if (token && token !== 'cookie') {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await axiosInstance.get('/settings', {
          headers,
          withCredentials: true
        });
        if (response.data) {
          setSettings(prev => ({
            ...prev,
            ...response.data,
            darkMode: document.documentElement.classList.contains('dark')
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchSettings();
    }
  }, [token]);

  const handleToggle = async (setting: keyof typeof settings) => {
    setToggleLoading(prev => ({ ...prev, [setting]: true }));
    try {
      if (setting === 'darkMode') {
        document.documentElement.classList.toggle('dark');
        const newDarkMode = document.documentElement.classList.contains('dark');
        setSettings(prev => ({ ...prev, darkMode: newDarkMode }));
        localStorage.setItem('darkMode', String(newDarkMode));
      } else {
        const newValue = !settings[setting];
        setSettings(prev => ({ ...prev, [setting]: newValue }));
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
      // Revert the change if the API call fails
      if (setting === 'darkMode') {
        document.documentElement.classList.toggle('dark');
        setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
      } else {
        setSettings(prev => ({ ...prev, [setting]: !prev[setting] }));
      }
    } finally {
      setToggleLoading(prev => ({ ...prev, [setting]: false }));
    }
  };

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const newTime = e.target.value;
      setSettings(prev => ({ ...prev, reminderTime: newTime }));
    } catch (error) {
      console.error('Error updating reminder time:', error);
      toast.error('Failed to update reminder time');
      // Revert the change if the API call fails
      setSettings(prev => ({ ...prev, reminderTime: prev.reminderTime }));
    }
  };

  const handleLogout = () => {
    if (window.confirm('Do you really want to log out?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8">
          Settings
        </h1>

        {/* User Profile */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Profile</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <span className="text-2xl font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-2 break-words">
                {user?.name || 'User'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 break-all leading-relaxed">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                {settings.darkMode ? (
                  <FiMoon className="w-6 h-6 text-neutral-600 dark:text-neutral-400 mr-4 flex-shrink-0" />
                ) : (
                  <FiSun className="w-6 h-6 text-neutral-600 dark:text-neutral-400 mr-4 flex-shrink-0" />
                )}
                <span className="text-neutral-700 dark:text-neutral-300 text-lg">Dark Mode</span>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  settings.darkMode ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                } flex-shrink-0`}
                disabled={toggleLoading['darkMode']}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.darkMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Notifications</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <FiBell className="w-6 h-6 text-neutral-600 dark:text-neutral-400 mr-4 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300 text-lg">Push Notifications</span>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                } flex-shrink-0`}
                disabled={toggleLoading['notifications']}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.notifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0 flex-1">
                <FiBell className="w-6 h-6 text-neutral-600 dark:text-neutral-400 mr-4 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300 text-lg">Email Notifications</span>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-neutral-200 dark:bg-neutral-700'
                } flex-shrink-0`}
                disabled={toggleLoading['emailNotifications']}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    settings.emailNotifications ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center min-w-0 flex-1">
                <FiBell className="w-6 h-6 text-neutral-600 dark:text-neutral-400 mr-4 flex-shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-300 text-lg">Daily Reminder Time</span>
              </div>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={handleTimeChange}
                className="input w-32 h-12 text-center text-lg font-medium"
              />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Account</h2>
          <div className="space-y-4">
            <button 
              className="w-full p-4 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 transition-all duration-200 hover:shadow-md font-medium text-lg"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 