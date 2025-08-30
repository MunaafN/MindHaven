import express from 'express';
// import { protect } from '../middleware/auth'; // Temporarily removed for functionality

const router = express.Router();

// Mock user ID for now - can be replaced with real auth later
const MOCK_USER_ID = 'mock-user-123';

// Mock review data for now
const mockReviewData = {
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
  moodDistribution: {
    happy: '53%',
    neutral: '33%',
    sad: '14%'
  },
  totalMoodEntries: 15,
  weeklyTrend: [7, 8, 6, 9, 7, 8, 7],
  achievements: [
    {
      id: 'achievement_1',
      title: 'Mood Tracker',
      description: 'Tracked mood for 7 consecutive days',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'achievement_2',
      title: 'Activity Enthusiast',
      description: 'Completed 5 wellness activities',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// Get mental health review data
router.get('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    // Return mock review data
    res.json({
      success: true,
      data: mockReviewData
    });
  } catch (error) {
    console.error('Error fetching review data:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get review insights
router.get('/insights', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        insights: mockReviewData.insights,
        weeklyTrend: mockReviewData.weeklyTrend
      }
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get review recommendations
router.get('/recommendations', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        recommendations: mockReviewData.recommendations
      }
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get mood distribution
router.get('/mood-distribution', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        moodDistribution: mockReviewData.moodDistribution,
        totalMoodEntries: mockReviewData.totalMoodEntries
      }
    });
  } catch (error) {
    console.error('Error fetching mood distribution:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get achievements
router.get('/achievements', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        achievements: mockReviewData.achievements
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get overall score
router.get('/score', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        overallScore: mockReviewData.overallScore
      }
    });
  } catch (error) {
    console.error('Error fetching overall score:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get weekly trend
router.get('/weekly-trend', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    res.json({
      success: true,
      data: {
        weeklyTrend: mockReviewData.weeklyTrend,
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      }
    });
  } catch (error) {
    console.error('Error fetching weekly trend:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 