import React from 'react';
import { Link } from 'react-router-dom';
import { FiSmile, FiBookOpen, FiActivity, FiMessageCircle, FiTrendingUp, FiStar } from 'react-icons/fi';
import mindeaseLogo from '../assets/mindease-logo.svg';

const features = [
  {
    icon: <FiSmile className="w-10 h-10" />,
    title: 'Mood Tracking',
    desc: 'Track your daily moods and visualize your emotional trends over time.',
    to: '/mood',
    gradient: 'from-emerald-500 to-green-600',
  },
  {
    icon: <FiBookOpen className="w-10 h-10" />,
    title: 'Journaling',
    desc: 'Reflect on your thoughts and feelings with secure, private journal entries.',
    to: '/journal',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    icon: <FiActivity className="w-10 h-10" />,
    title: 'Wellbeing Activities',
    desc: 'Engage in science-backed activities to boost your mental health.',
    to: '/activities',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: <FiMessageCircle className="w-10 h-10" />,
    title: 'AI Chatbot',
    desc: 'Get instant support and insights from our AI-powered mental health assistant.',
    to: '/dashboard',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: <FiTrendingUp className="w-10 h-10" />,
    title: 'Progress Tracking',
    desc: 'See your growth and celebrate your mental health milestones.',
    to: '/progress',
    gradient: 'from-orange-500 to-red-600',
  },
  {
    icon: <FiStar className="w-10 h-10" />,
    title: 'Joy Corner',
    desc: 'Play games, enjoy uplifting content, and boost your mood in the Joy Corner.',
    to: '/joy-corner',
    gradient: 'from-red-500 to-pink-600',
  },
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 flex flex-col items-center justify-start px-6 py-12">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto flex flex-col items-center text-center mb-20 animate-fade-in">
        <div className="relative mb-8">
          <img src={mindeaseLogo} alt="MindHaven Logo" className="h-24 w-24 drop-shadow-2xl animate-float" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/30 to-secondary-500/30 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-gradient bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6 tracking-tight">
          MindHaven
        </h1>
        <p className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 mb-8 font-medium max-w-3xl leading-relaxed">
          Your all-in-one companion for mental wellness, self-reflection, and growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/dashboard" className="btn btn-primary px-10 py-4 text-xl font-bold shadow-glow hover:shadow-glow-lg transform hover:scale-105 active:scale-95">
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 animate-slide-up">
        {features.map((feature, idx) => (
          <Link
            to={feature.to}
            key={idx}
            className="group card-glass p-8 flex flex-col items-center text-center border border-white/20 dark:border-neutral-700/30 transition-all duration-500 hover:scale-105 hover:shadow-glow-lg hover:border-white/40 dark:hover:border-neutral-500/50"
            style={{ textDecoration: 'none' }}
          >
            <div className={`p-6 rounded-3xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300 transform group-hover:scale-110 relative overflow-hidden icon-gradient`}>
              <div className="absolute inset-0 bg-white/20 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-3xl"></div>
              <div className="relative z-10">
                {React.cloneElement(feature.icon, { 
                  className: "w-12 h-12 text-white feature-icon",
                })}
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 rounded-3xl"></div>
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-4 group-hover:text-gradient transition-all duration-300">
              {feature.title}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
              {feature.desc}
            </p>
          </Link>
        ))}
      </section>

      {/* Call to Action */}
      <section className="w-full max-w-3xl mx-auto text-center mt-12 mb-20 animate-fade-in">
        <h2 className="text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6">
          Start Your Wellness Journey Today
        </h2>
        <p className="text-xl text-neutral-700 dark:text-neutral-300 mb-10 leading-relaxed">
          Join MindHaven and take the first step towards a happier, healthier you.
        </p>
        <Link
          to="/dashboard"
          className="btn btn-secondary px-12 py-4 text-xl font-bold shadow-glow-purple hover:shadow-glow-lg transform hover:scale-105 active:scale-95"
        >
          Get Started
        </Link>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-4xl mx-auto mt-20 mb-16 card-gradient p-10 animate-slide-up">
        <h2 className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-8 text-center">
          How MindHaven Works
        </h2>
        <ul className="text-lg text-neutral-700 dark:text-neutral-300 space-y-6">
          <li className="flex items-start gap-4">
            <span className="badge badge-primary">1</span>
            <span><strong className="text-primary-600 dark:text-primary-400">Mood Tracking:</strong> Go to the <strong>Mood</strong> tab to log your daily mood and see your emotional trends.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="badge badge-secondary">2</span>
            <span><strong className="text-secondary-600 dark:text-secondary-400">Journaling:</strong> Use the <strong>Journal</strong> tab to write and reflect on your thoughts and feelings.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="badge badge-success">3</span>
            <span><strong className="text-success-600 dark:text-success-400">Wellbeing Activities:</strong> Visit the <strong>Activities</strong> tab for guided exercises and activities to boost your mental health.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="badge badge-warning">4</span>
            <span><strong className="text-warning-600 dark:text-warning-400">AI Chatbot:</strong> Access the <strong>Dashboard</strong> for instant support and insights from our AI assistant.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="badge badge-error">5</span>
            <span><strong className="text-error-600 dark:text-error-400">Progress Tracking:</strong> Check the <strong>Progress</strong> tab to visualize your growth and celebrate milestones.</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="badge badge-primary">6</span>
            <span><strong className="text-primary-600 dark:text-primary-400">Joy Corner:</strong> Head to the <strong>Joy Corner</strong> for games, uplifting content, and mood-boosting fun.</span>
          </li>
        </ul>
        <p className="mt-10 text-center text-base text-neutral-600 dark:text-neutral-400">
          Explore each tab from the sidebar to get the most out of MindHaven and support your mental wellness journey!
        </p>
      </section>
    </div>
  );
};

export default Home; 