import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSmile, FiBookOpen, FiActivity, FiTrendingUp, FiHeart, FiTarget, FiCalendar, FiAward } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    journalEntries: 0,
    activitiesCompleted: 0,
    currentStreak: 0,
    weeklyAverage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch journal entries count
      const journalResponse = await fetch('http://localhost:5000/journal');
      const journalData = await journalResponse.json();
      
      // Fetch activities count
      const activitiesResponse = await fetch('http://localhost:5000/activities');
      const activitiesData = await activitiesResponse.json();
      
      // Fetch progress data
      const progressResponse = await fetch('http://localhost:5000/progress');
      const progressData = await progressResponse.json();
      
      setStats({
        journalEntries: journalData.length || 0,
        activitiesCompleted: activitiesData.filter((a: any) => a.completed).length || 0,
        currentStreak: progressData.streak || 0,
        weeklyAverage: progressData.weeklyAverage || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values if fetch fails
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Welcome to MindHaven
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Your personal mental wellness companion. Track your progress, reflect on your journey, and discover new ways to thrive.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="card-gradient p-6 text-center group hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <FiSmile className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Start Tracking</h3>
          <p className="text-neutral-600 dark:text-neutral-400">Your daily mood</p>
        </div>

        <div className="card-gradient p-6 text-center group hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow-purple group-hover:shadow-glow-lg transition-all duration-300">
            <FiBookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            {loading ? '...' : stats.journalEntries}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">Journal entries</p>
        </div>

        <div className="card-gradient p-6 text-center group hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-success-500 to-success-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow-green group-hover:shadow-glow-lg transition-all duration-300">
            <FiActivity className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            {loading ? '...' : stats.activitiesCompleted}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">Activities completed</p>
        </div>

        <div className="card-gradient p-6 text-center group hover:scale-105 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-accent-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
            <FiTrendingUp className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            {loading ? '...' : stats.currentStreak} days
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">Current streak</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Mood Tracking Card */}
          <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-success-500 to-success-600 rounded-2xl flex items-center justify-center shadow-glow-green">
                <FiSmile className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Mood Tracking</h3>
                <p className="text-neutral-600 dark:text-neutral-400">How are you feeling today?</p>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Start your day by logging your mood and adding notes about how you're feeling. Track your emotional patterns over time.
            </p>
            <button 
              className="btn btn-success w-full"
              onClick={() => handleNavigation('/mood')}
            >
              Track My Mood
            </button>
          </div>

          {/* Journal Card */}
          <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
                <FiBookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Journal</h3>
                <p className="text-neutral-600 dark:text-neutral-400">Reflect and grow</p>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Write about your thoughts, feelings, and experiences. Journaling helps with self-reflection and emotional processing.
            </p>
            <button 
              className="btn btn-primary w-full"
              onClick={() => handleNavigation('/journal')}
            >
              Write Entry
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Activities Card */}
          <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-glow-purple">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Wellness Activities</h3>
                <p className="text-neutral-600 dark:text-neutral-400">Boost your mental health</p>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Discover science-backed activities designed to improve your mental wellbeing and reduce stress.
            </p>
            <button 
              className="btn btn-secondary w-full"
              onClick={() => handleNavigation('/activities')}
            >
              Explore Activities
            </button>
          </div>

          {/* Progress Card */}
          <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-glow">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Progress</h3>
                <p className="text-neutral-600 dark:text-neutral-400">Track your growth</p>
              </div>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Visualize your mental health journey with charts, insights, and progress tracking.
            </p>
            <button 
              className="btn btn-accent w-full"
              onClick={() => handleNavigation('/progress')}
            >
              View Progress
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16">
        <div className="card-gradient p-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow-lg">
            <FiAward className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            Every step you take towards mental wellness is a victory. Start small, be consistent, and watch yourself grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn btn-primary px-8 py-3"
              onClick={() => handleNavigation('/mood')}
            >
              Get Started
            </button>
            <button 
              className="btn btn-outline px-8 py-3"
              onClick={() => handleNavigation('/awareness')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 