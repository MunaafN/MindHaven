import React, { useState } from 'react';
import { FiTrendingUp, FiCheckCircle, FiActivity, FiHeart, FiSmile } from 'react-icons/fi';

interface MoodEntry {
  mood: string;
}

interface AnalysisData {
  overallScore: number;
  insights: string[];
  recommendations: string[];
  moodDistribution?: {
    happy: string;
    neutral: string;
    sad: string;
  };
  totalMoodEntries?: number;
}

const getSummary = (score: number) => {
  if (score >= 80) {
    return 'Excellent! You are maintaining a high level of well-being. Keep up the great work!';
  } else if (score >= 60) {
    return 'Good! Your well-being is stable, but there is still room for improvement.';
  } else if (score >= 40) {
    return 'Fair. Consider focusing on activities and habits that boost your mood and well-being.';
  } else {
    return 'Low. Take time for self-care and consider reaching out for support if needed.';
  }
};

const calculateMoodDistribution = (moodEntries: MoodEntry[]) => {
  if (!moodEntries || moodEntries.length === 0) {
    return {
      happy: '0%',
      neutral: '0%',
      sad: '0%'
    };
  }
  const counts = { happy: 0, neutral: 0, sad: 0 };
  moodEntries.forEach(entry => {
    if (entry.mood === 'happy') counts.happy++;
    else if (entry.mood === 'neutral') counts.neutral++;
    else if (entry.mood === 'sad') counts.sad++;
  });
  const total = moodEntries.length;
  return {
    happy: `${Math.round((counts.happy / total) * 100)}%`,
    neutral: `${Math.round((counts.neutral / total) * 100)}%`,
    sad: `${Math.round((counts.sad / total) * 100)}%`
  };
};

const Review: React.FC = () => {
  const [loading] = useState(false);
  
  // Mock data for demonstration
  const moodEntries: MoodEntry[] = [
    { mood: 'happy' },
    { mood: 'happy' },
    { mood: 'neutral' },
    { mood: 'sad' },
    { mood: 'happy' }
  ];

  // Calculate mood distribution from mood tab data
  const moodDistribution = calculateMoodDistribution(moodEntries);
  const totalMoodEntries = moodEntries.length;

  // Mock analysis data
  const analysis: AnalysisData = {
    overallScore: 75,
    insights: [
      "You've been consistently tracking your mood",
      "Your mood has improved over the last week",
      "You're engaging well with wellness activities"
    ],
    recommendations: [
      "Continue with your current routine",
      "Try adding more physical activity",
      "Consider journaling more frequently"
    ],
    moodDistribution: moodDistribution,
    totalMoodEntries: totalMoodEntries
  };

  const quote = "Every day is a new beginning. Take a deep breath and start again.";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">Analyzing your mental health data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Your Mental Health Review
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            AI-powered analysis of your mental well-being
          </p>
        </div>

        {/* Positive Quote Card - Softer colors */}
        <div className="card bg-gradient-to-r from-blue-600/80 to-indigo-700/80 dark:from-blue-700/60 dark:to-indigo-800/60 text-white p-8 shadow-glow">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-semibold">Thought for Today</h2>
          </div>
          <div className="py-4">
            <p className="text-xl italic leading-relaxed text-white/95">"{quote}"</p>
          </div>
        </div>

        {/* Overall Score - Softer colors */}
        <div className="card bg-gradient-to-r from-emerald-600/80 to-teal-700/80 dark:from-emerald-700/60 dark:to-teal-800/60 text-white p-8 shadow-glow">
          <h2 className="text-2xl font-semibold mb-6">Overall Well-being Score</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl sm:text-7xl font-bold mb-4 text-white/95">{analysis?.overallScore || 0}%</div>
            <div className="text-xl text-white/90 text-center leading-relaxed max-w-2xl">
              {getSummary(analysis?.overallScore || 0)}
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <FiActivity className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Key Insights</h2>
          </div>
          <div className="space-y-4">
            {analysis?.insights && analysis.insights.length > 0 ? (
              analysis.insights.map((insight: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-neutral-50 dark:bg-neutral-800/30 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/40 mt-1 flex-shrink-0">
                    <FiTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">{insight}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-lg">No insights available yet</p>
                <p className="text-neutral-400 dark:text-neutral-500 text-base">Continue logging your moods, activities, and journal entries to generate personalized insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <FiHeart className="w-6 h-6 text-success-600 dark:text-success-400 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Recommendations</h2>
          </div>
          <div className="space-y-4">
            {analysis?.recommendations && analysis.recommendations.length > 0 ? (
              analysis.recommendations.slice(0, 5).map((rec: any, index: number) => (
                <div key={index} className="flex items-start gap-4 p-6 bg-neutral-50 dark:bg-neutral-800/30 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <div className="p-3 rounded-full bg-success-100 dark:bg-success-900/40 mt-1 flex-shrink-0">
                    <FiCheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral-700 dark:text-neutral-300 text-lg leading-relaxed">{rec}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                <p className="text-neutral-500 dark:text-neutral-400 text-lg">No recommendations available yet</p>
                <p className="text-neutral-400 dark:text-neutral-500 text-base">Track your mental health activities to receive personalized recommendations</p>
              </div>
            )}
          </div>
        </div>

        {/* Mood Distribution - Softer colors */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <FiSmile className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
            <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">Your Mood Distribution</h2>
          </div>
          {totalMoodEntries > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{moodDistribution.happy}</p>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium">Happy</p>
              </div>
              <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">{moodDistribution.neutral}</p>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium">Neutral</p>
              </div>
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{moodDistribution.sad}</p>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium">Sad</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">No mood data available yet</p>
              <p className="text-neutral-400 dark:text-neutral-500 text-base">Track your mood regularly to see your mood distribution</p>
            </div>
          )}
          <p className="text-center text-neutral-500 dark:text-neutral-400 text-base">
            Based on your {totalMoodEntries || '0'} mood entries over the past 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default Review; 