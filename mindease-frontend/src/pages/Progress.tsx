import { useState, useEffect, useCallback } from 'react';
import { FiTrendingUp, FiAward, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { BiBrain } from 'react-icons/bi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define interface for assessment history
interface AssessmentHistory {
  id: string;
  date: string;
  score: string;
  scoreLevel: 'low' | 'moderate' | 'high';
}

// Define interface for assessment questions
interface AssessmentQuestion {
  id: string;
  text: string;
}

// Define interface for stats
interface Stats {
  weeklyAverage: number;
  streak: number;
  activitiesCompleted: number;
  moodData: {
    labels: string[];
    data: number[];
  };
  activityData: {
    labels: string[];
    data: number[];
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const Progress = () => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [stats, setStats] = useState<Stats>({
    weeklyAverage: 0,
    streak: 0,
    activitiesCompleted: 0,
    moodData: {
      labels: [],
      data: []
    },
    activityData: {
      labels: [],
      data: []
    },
    achievements: []
  });
  
  // Mental health assessment states
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistory[]>([
    { id: '1', date: '2024-01-15', score: '75', scoreLevel: 'moderate' },
    { id: '2', date: '2024-01-08', score: '68', scoreLevel: 'moderate' },
    { id: '3', date: '2024-01-01', score: '82', scoreLevel: 'high' }
  ]);
  const [showHistory, setShowHistory] = useState(false);

  // Define the assessment questions
  const assessmentQuestions: AssessmentQuestion[] = [
    { id: 'q1', text: 'How often have you felt down, depressed, or hopeless in the past 2 weeks?' },
    { id: 'q2', text: 'How often have you had little interest or pleasure in doing things you usually enjoy?' },
    { id: 'q3', text: 'How would you rate your sleep quality over the past 2 weeks?' },
    { id: 'q4', text: 'How often have you felt nervous, anxious, or on edge?' },
    { id: 'q5', text: 'How difficult has it been to relax or control worry?' },
    { id: 'q6', text: 'How would you rate your energy levels throughout the day?' },
    { id: 'q7', text: 'How often have you had trouble concentrating on tasks?' },
    { id: 'q8', text: 'How would you rate your ability to cope with stress?' },
    { id: 'q9', text: 'How connected do you feel to friends, family, or your community?' },
    { id: 'q10', text: 'How hopeful do you feel about the future?' }
  ];

  // Mock data loading
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Process mood entries to generate chart data
  useEffect(() => {
    if (stats.moodData && stats.moodData.labels.length > 0) {
      // Sort entries by date
      const sortedEntries = [...stats.moodData.labels].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      
      // Get up to the last 7 entries or fewer if not enough entries
      const recentEntries = sortedEntries.slice(-7);
      
      // Create arrays for labels and data
      const labels = recentEntries.map(entry => 
        new Date(entry).toLocaleDateString('en-US', { weekday: 'short' })
      );
      
      // Convert mood to numeric value for chart
      const data = recentEntries.map(entry => {
        switch (entry) {
          case 'Mon': return 7;  // High value for happy
          case 'Tue': return 8; // Middle value for neutral
          case 'Wed': return 6;    // Low value for sad
          default: return 0;
        }
      });
      
      // Update stats with the mood data
      setStats(prev => ({
        ...prev,
        moodData: {
          labels,
          data
        }
      }));
    }
  }, [stats.moodData]);

  // Fetch real progress data
  const fetchProgressData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch activities
      const activitiesResponse = await fetch('http://localhost:5000/activities');
      const activities = activitiesResponse.ok ? await activitiesResponse.json() : [];
      
      // Fetch moods
      const moodsResponse = await fetch('http://localhost:5000/moods');
      const moods = moodsResponse.ok ? await moodsResponse.json() : [];
      
      // Calculate real-time stats
      const completedActivities = activities.filter((activity: any) => activity.completed);
      const activitiesCompleted = completedActivities.length;
      
      // Calculate weekly average (mood scores)
      const recentMoods = moods.slice(-7);
      const weeklyAverage = recentMoods.length > 0 
        ? recentMoods.reduce((sum: number, mood: any) => sum + (mood.intensity || 0), 0) / recentMoods.length
        : 0;
      
      // Calculate streak (consecutive days with activities)
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasActivity = activities.some((activity: any) => 
          activity.completed && activity.date && activity.date.startsWith(dateStr)
        );
        if (hasActivity) {
          streak++;
        } else {
          break;
        }
      }
      
      // Generate mood chart data
      const moodLabels = recentMoods.map((mood: any) => {
        const date = new Date(mood.date);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      });
      const moodData = recentMoods.map((mood: any) => mood.intensity || 0);
      
      // Generate activity chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      const activityLabels = last7Days.map(date => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      });
      
      const activityData = last7Days.map(date => {
        return activities.filter((activity: any) => 
          activity.completed && activity.date && activity.date.startsWith(date)
        ).length;
      });
      
      // Generate achievements based on real data
      const achievements = [];
      if (moods.length >= 7) {
        achievements.push({
          id: 'mood_tracker',
          title: 'Mood Tracker',
          description: 'Tracked mood for 7 consecutive days'
        });
      }
      if (completedActivities.length >= 5) {
        achievements.push({
          id: 'activity_enthusiast',
          title: 'Activity Enthusiast',
          description: 'Completed 5 wellness activities'
        });
      }
      if (streak >= 3) {
        achievements.push({
          id: 'consistent_user',
          title: 'Consistent User',
          description: `Maintained a ${streak}-day activity streak`
        });
      }
      
             setStats({
         weeklyAverage: Math.round(weeklyAverage * 10) / 10,
         streak,
         activitiesCompleted,
         moodData: {
           labels: moodLabels,
           data: moodData
         },
         activityData: {
           labels: activityLabels,
           data: activityData
         },
         achievements
       });
       
       setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch assessment history
  const fetchAssessmentHistory = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/review');
      if (response.ok) {
        const data = await response.json();
        if (data.assessmentHistory) {
          setAssessmentHistory(data.assessmentHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching assessment history:', error);
    }
  }, []);

  useEffect(() => {
    fetchProgressData();
    fetchAssessmentHistory();
  }, [fetchProgressData, fetchAssessmentHistory]);

  // Refetch data when component mounts
  useEffect(() => {
    fetchProgressData();
  }, [fetchProgressData]);

  // Auto-refresh data every 5 minutes to keep it current
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProgressData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchProgressData]);

  // Listen for mood entry changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // Force re-render when mood entries change
      setStats(prev => ({ ...prev }));
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes in the same tab
    const checkMoodEntries = () => {
      const savedEntries = localStorage.getItem('moodEntries');
      if (savedEntries) {
        try {
          const entries = JSON.parse(savedEntries);
          if (entries.length !== stats.moodData.labels.length) {
            handleStorageChange();
          }
        } catch (error) {
          console.error('Error checking mood entries:', error);
        }
      }
    };

    const interval = setInterval(checkMoodEntries, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [stats.moodData.labels.length]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitAssessment = async () => {
    if (Object.keys(assessmentAnswers).length < assessmentQuestions.length) {
      // toast.warning('Please answer all questions to get an accurate assessment'); // Removed toast
      return;
    }
    
    setAssessmentLoading(true);
    
    try {
             // Calculate score based on actual answers (1-5 scale, convert to 0-100)
       // For questions where higher scores indicate better mental health, keep as is
       // For questions where higher scores indicate worse mental health, invert them
       let totalScore = 0;
       Object.entries(assessmentAnswers).forEach(([questionId, value]) => {
         // Questions 1, 2, 4, 5, 7 are negative indicators (higher score = worse mental health)
         // Questions 3, 6, 8, 9, 10 are positive indicators (higher score = better mental health)
         if (['q1', 'q2', 'q4', 'q5', 'q7'].includes(questionId)) {
           totalScore += (6 - value); // Invert: 1 becomes 5, 2 becomes 4, etc.
         } else {
           totalScore += value; // Keep as is
         }
       });
       
       const maxPossibleScore = assessmentQuestions.length * 5;
       const calculatedScore = Math.round((totalScore / maxPossibleScore) * 100);
       
       // Determine score level based on calculated score
       let scoreLevel: 'low' | 'moderate' | 'high';
       let analysis: string;
       let recommendations: string[];
       
       if (calculatedScore >= 75) {
         scoreLevel = 'high';
         analysis = `Based on your answers, you are currently experiencing a high level of mental wellness. Your score is ${calculatedScore}/100, indicating good mental health practices and positive outlook.`;
         recommendations = [
           'Keep up your positive habits and routines',
           'Share your wellness strategies with others',
           'Continue engaging in activities that bring you joy',
           'Consider mentoring someone on their wellness journey'
         ];
       } else if (calculatedScore >= 50) {
         scoreLevel = 'moderate';
         analysis = `Based on your answers, you are currently experiencing a moderate level of mental wellness. Your score is ${calculatedScore}/100, suggesting some areas for improvement while maintaining overall stability.`;
         recommendations = [
           'Practice daily mindfulness or meditation',
           'Increase social connections and support',
           'Establish consistent sleep and exercise routines',
           'Consider journaling to track your mood patterns'
         ];
       } else {
         scoreLevel = 'low';
         analysis = `Based on your answers, you are currently experiencing a low level of mental wellness. Your score is ${calculatedScore}/100, indicating you may benefit from additional support and wellness strategies.`;
         recommendations = [
           'Consider speaking with a mental health professional',
           'Start with small, manageable wellness activities',
           'Reach out to friends, family, or support groups',
           'Practice self-compassion and avoid self-criticism'
         ];
       }

             setAssessmentResult({
         score: calculatedScore,
         scoreLevel: scoreLevel,
         analysis: analysis,
         recommendations: recommendations
       });
       setAssessmentHistory(prev => [...prev, {
         id: `assessment_${Date.now()}`,
         date: new Date().toISOString(),
         score: calculatedScore.toString(),
         scoreLevel: scoreLevel
       }]);
      setShowAssessment(false);
    } catch (error: any) {
      console.error('Error generating assessment:', error);
      // toast.error(errorMessage); // Removed toast
      setAssessmentResult(null);
    } finally {
      setAssessmentLoading(false);
      setAssessmentAnswers({});
    }
  };

  const resetAssessment = () => {
    setAssessmentResult(null);
    setAssessmentAnswers({});
    setShowAssessment(true);
  };

  // Helper functions for mood tracking graph
  const generateMoodGraphData = () => {
    // Get mood entries from localStorage
    const savedEntries = localStorage.getItem('moodEntries');
    if (!savedEntries) return '';
    
    try {
      const entries = JSON.parse(savedEntries);
      if (!Array.isArray(entries) || entries.length === 0) return '';
      
      // Get last 7 entries
      const recentEntries = entries.slice(-7);
      
              return recentEntries
          .map((entry, index) => {
            const moodValue = getMoodValue(entry.mood);
            const x = (index / (recentEntries.length - 1)) * 100;
            const y = ((4 - moodValue) / 3) * 100;
            return `${x},${y}`;
          })
          .join(' ');
    } catch (error) {
      console.error('Error parsing mood entries:', error);
      return '';
    }
  };

  const generateMoodGraphPoints = () => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (!savedEntries) return null;
    
    try {
      const entries = JSON.parse(savedEntries);
      if (!Array.isArray(entries) || entries.length === 0) return null;
      
      const recentEntries = entries.slice(-7);
      
      return recentEntries.map((entry, index) => {
        const moodValue = getMoodValue(entry.mood);
        const x = (index / (recentEntries.length - 1)) * 100;
        const y = ((4 - moodValue) / 3) * 100;
        
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill="rgb(59, 130, 246)"
            stroke="white"
            strokeWidth="2"
          />
        );
      });
    } catch (error) {
      console.error('Error parsing mood entries:', error);
      return null;
    }
  };

  const generateMoodGraphLabels = () => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (!savedEntries) return [];
    
    try {
      const entries = JSON.parse(savedEntries);
      if (!Array.isArray(entries) || entries.length === 0) return [];
      
      const recentEntries = entries.slice(-7);
      
      return recentEntries.map((entry, index) => (
        <span key={index} className="text-center">
          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      ));
    } catch (error) {
      console.error('Error parsing mood entries:', error);
      return [];
    }
  };

  const getMoodValue = (moodType: string) => {
    switch (moodType) {
      case 'happy': return 3;
      case 'neutral': return 2;
      case 'sad': return 1;
      default: return 2;
    }
  };

  // Prepare chart data from real user data
  const moodData: ChartData<'line'> = {
    labels: stats.moodData.labels,
    datasets: [
      {
        label: 'Mood Level',
        data: stats.moodData.data,
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const activityData: ChartData<'bar'> = {
    labels: stats.activityData.labels,
    datasets: [
      {
        label: 'Activities Completed',
        data: stats.activityData.data,
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
                 callbacks: {
           label: function(context: any) {
             const value = context.raw;
             let moodLabel = 'Unknown';
             
             if (value >= 2.5) moodLabel = 'Happy';
             else if (value >= 1.5) moodLabel = 'Neutral';
             else if (value > 0) moodLabel = 'Sad';
             
             return `Mood: ${moodLabel} (${value})`;
           }
         }
      }
    },
         scales: {
       y: {
         beginAtZero: true,
         max: 3,
         ticks: {
           stepSize: 1,
           callback: function(tickValue: number | string) {
             const value = Number(tickValue);
             switch(value) {
               case 3: return 'Happy';
               case 2: return 'Neutral';
               case 1: return 'Sad';
               case 0: return '';
               default: return '';
             }
           }
         }
       },
     },
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your progress data...</p>
      </div>
    );
  }

  // Removed token check as it's no longer needed
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
                 <div className="text-center mb-8">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
             <div className="flex-1">
               <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                 Your Progress
               </h1>
               <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                 Track your mental wellness journey and celebrate your achievements
               </p>
             </div>
             <button
               onClick={fetchProgressData}
               disabled={loading}
               className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
             >
               {loading ? (
                 <div className="flex items-center">
                   <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                   Refreshing...
                 </div>
               ) : (
                 <div className="flex items-center">
                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Refresh Data
                 </div>
               )}
             </button>
           </div>
           {lastUpdated && (
             <div className="text-center">
               <p className="text-sm text-neutral-500 dark:text-neutral-400">
                 Last updated: {lastUpdated.toLocaleTimeString('en-US', { 
                   hour: '2-digit', 
                   minute: '2-digit',
                   hour12: true 
                 })}
               </p>
             </div>
           )}
         </div>
        
        {/* Mental Health Assessment Card */}
        <div className="card bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
          <div className="flex items-start gap-3 mb-4">
            <BiBrain className="w-6 h-6 flex-shrink-0 mt-1" />
            <h2 className="text-xl font-semibold leading-tight">Mental Health Status</h2>
          </div>
          <p className="mb-6 text-white/90 leading-relaxed text-base break-words">
            Take a quick assessment to understand your current mental health status and track changes over time.
          </p>
          
          {!showAssessment && !assessmentResult && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                             <button 
                 onClick={() => setShowAssessment(true)}
                 className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-medium hover:bg-indigo-100 transition-colors w-full sm:w-auto border-none outline-none focus:outline-none focus:ring-0"
               >
                 Start Assessment
               </button>
              
                             {assessmentHistory.length > 0 && (
                 <button 
                   onClick={() => setShowHistory(!showHistory)}
                   className="flex items-center justify-center text-white/90 hover:text-white underline text-sm sm:text-base border-none outline-none focus:outline-none focus:ring-0 hover:border-none"
                 >
                   {showHistory ? 'Hide history' : 'View past assessments'}
                   <FiChevronRight className={`ml-1 transform transition-transform ${showHistory ? 'rotate-90' : ''}`} />
                 </button>
               )}
            </div>
          )}
          
          {/* Show assessment history */}
          {showHistory && (
            <div className="mt-6 bg-white/10 p-6 rounded-lg">
              <h3 className="font-medium mb-4 text-lg">Assessment History</h3>
              {assessmentHistory.length > 0 ? (
                <div className="space-y-3">
                  {assessmentHistory.map((assessment) => (
                    <div key={assessment.id} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                      <span className="text-white/90">{formatDate(assessment.date)}</span>
                      <div className="flex items-center">
                        <span 
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            assessment.scoreLevel === 'high' 
                              ? 'bg-green-400' 
                              : assessment.scoreLevel === 'moderate' 
                                ? 'bg-yellow-400' 
                                : 'bg-red-400'
                          }`}
                        ></span>
                                                 <span className="font-medium">{assessment.score}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/80">No assessment history available yet.</p>
              )}
            </div>
          )}
          
          {/* Assessment Questions */}
          {showAssessment && !assessmentResult && (
            <div className="mt-6">
              <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                <h3 className="font-medium mb-6 text-lg">Mental Health Assessment</h3>
                <div className="space-y-6">
                  {assessmentQuestions.map(question => (
                    <div key={question.id} className="mb-4">
                      <label className="block mb-3 text-white/90 leading-relaxed break-words text-sm sm:text-base">
                        {question.text}
                      </label>
                      <div className="flex justify-between mb-2 text-xs text-white/70">
                        <span>Not at all</span>
                        <span>Extremely</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(value => (
                          <button
                            key={value}
                            className={`py-3 px-2 rounded-lg font-medium transition-colors text-sm ${
                              assessmentAnswers[question.id] === value 
                                ? 'bg-white text-indigo-700' 
                                : 'bg-white/30 hover:bg-white/50 text-white'
                            }`}
                            onClick={() => handleAnswerChange(question.id, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                                     <button
                     onClick={() => setShowAssessment(false)}
                     className="px-6 py-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors text-white w-full sm:w-auto border-none outline-none focus:outline-none focus:ring-0"
                   >
                     Cancel
                   </button>
                   <button
                     onClick={handleSubmitAssessment}
                     className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors w-full sm:w-auto border-none outline-none focus:outline-none focus:ring-0"
                     disabled={assessmentLoading}
                   >
                    {assessmentLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-4 h-4 border-2 border-indigo-700 border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </div>
                    ) : 'Submit Assessment'}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Assessment Results */}
          {assessmentResult && (
            <div className="mt-6">
              <div className="bg-white/10 p-4 sm:p-6 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="font-medium text-lg">Your Results</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      assessmentResult.scoreLevel === 'high' 
                        ? 'bg-green-400' 
                        : assessmentResult.scoreLevel === 'moderate' 
                          ? 'bg-yellow-400' 
                          : 'bg-red-400'
                    }`}></div>
                                         <span className="font-medium">{assessmentResult.score}/100</span>
                  </div>
                </div>
                <p className="mb-4 text-white/90 leading-relaxed break-words text-sm sm:text-base">{assessmentResult.analysis}</p>
                <h4 className="font-medium mb-3">Suggested Activities:</h4>
                <ul className="list-disc pl-4 sm:pl-6 mb-6 text-white/90 space-y-2">
                  {(assessmentResult.recommendations && assessmentResult.recommendations.length > 0
                    ? assessmentResult.recommendations
                    : (assessmentResult.score <= 2
                        ? [
                            'Try a guided meditation session',
                            'Go for a short walk outdoors',
                            'Write down three things you are grateful for'
                          ]
                        : assessmentResult.score <= 4
                          ? [
                              'Practice deep breathing exercises',
                              'Connect with a friend or family member',
                              'Take a mindful break during your day'
                            ]
                          : [
                              'Keep up your positive habits!',
                              'Share your good mood with someone',
                              'Try a new activity for fun'
                            ]
                    )
                  ).map((rec: string, index: number) => (
                    <li key={index} className="break-words text-sm sm:text-base leading-relaxed">{rec}</li>
                  ))}
                </ul>
                                 <div className="flex flex-col sm:flex-row gap-4 justify-between">
                   <button
                     onClick={() => setAssessmentResult(null)}
                     className="px-6 py-3 bg-white/30 rounded-lg hover:bg-white/40 transition-colors text-white w-full sm:w-auto border-none outline-none focus:outline-none focus:ring-0"
                   >
                     Close
                   </button>
                   <button
                     onClick={resetAssessment}
                     className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors w-full sm:w-auto border-none outline-none focus:outline-none focus:ring-0"
                   >
                     Take New Assessment
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
        
                 {/* Stats Overview */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading && (
             <div className="col-span-full flex justify-center py-4">
               <div className="flex items-center text-primary-600 dark:text-primary-400">
                 <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-current mr-2"></div>
                 <span className="text-sm">Updating progress data...</span>
               </div>
             </div>
           )}
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 flex-shrink-0">
                <FiTrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Weekly Average</h2>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.weeklyAverage.toFixed(1)}/5
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 dark:bg-secondary-900 flex-shrink-0">
                <FiAward className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Current Streak</h2>
                <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  {stats.streak} days
                </p>
              </div>
            </div>
          </div>
          <div className="card p-6 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0">
                <FiCalendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-1">Activities Completed</h2>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.activitiesCompleted}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mood Tracking Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Mood Tracking</h2>
          <div className="h-[300px] w-full">
            <Line data={moodData} options={chartOptions} />
          </div>
        </div>
        
        {/* Activity Completion Chart */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Activity Completion</h2>
          <div className="h-[300px] w-full">
            <Bar data={activityData} options={chartOptions} />
          </div>
        </div>
        
        {/* Mood Tracking Graph - Vertical Scale */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Mood Tracking Graph</h2>
          <div className="relative h-80 bg-gradient-to-br from-neutral-50 to-blue-50 dark:from-neutral-800/50 dark:to-blue-900/20 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-20 flex flex-col justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span className="font-medium">Happy</span>
              <span className="font-medium">Neutral</span>
              <span className="font-medium">Sad</span>
            </div>

            {/* Grid lines */}
            <div className="absolute left-20 right-0 top-0 bottom-0">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="absolute w-full border-t border-neutral-200 dark:border-neutral-600"
                  style={{ top: `${((4 - level) / 3) * 100}%` }}
                />
              ))}
            </div>

            {/* Chart area */}
            <div className="absolute left-20 right-0 top-0 bottom-0">
              {/* Mood Level Legend */}
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded border border-blue-300"></div>
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">Mood Level</span>
              </div>

              {/* Chart line and points */}
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Chart line */}
                <polyline
                  fill="none"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="2"
                  points={generateMoodGraphData()}
                />
                
                {/* Data points */}
                {generateMoodGraphPoints()}
              </svg>

              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                {generateMoodGraphLabels()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-6">Recent Achievements</h2>
          {stats.achievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievements.map((achievement, index) => (
                <div key={index} className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 flex-shrink-0">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-neutral-800 dark:text-neutral-200 mb-1 break-words">{achievement.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 break-words leading-relaxed">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-lg mb-2">No achievements yet</p>
              <p className="text-base">Complete more activities to earn achievements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress; 