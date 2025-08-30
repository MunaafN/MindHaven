import express from 'express';
import Mood from '../models/Mood';
// import { protect } from '../middleware/auth'; // Temporarily removed for functionality

const router = express.Router();

// Mock user ID for now - can be replaced with real auth later
const MOCK_USER_ID = 'mock-user-123';

// Store user progress data in memory for now
export const userProgress: Record<string, any> = {};

// Get all moods for a user
router.get('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    // For now, return mock data since we're not using database
    const mockMoods = [
      {
        id: '1',
        mood: 'happy',
        intensity: 8,
        notes: 'Feeling great today!',
        date: new Date().toISOString(),
        userId: userId
      },
      {
        id: '2',
        mood: 'calm',
        intensity: 7,
        notes: 'Peaceful and relaxed',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        userId: userId
      }
    ];
    
    res.json(mockMoods);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add a new mood entry
router.post('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { mood, intensity, notes } = req.body;

    // Validate input
    if (!mood || !intensity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mood and intensity are required' 
      });
    }

    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'Intensity must be between 1 and 10' 
      });
    }

    // Create new mood entry
    const newMood = {
      id: Date.now().toString(),
      mood,
      intensity: parseInt(intensity),
      notes: notes || '',
      date: new Date().toISOString(),
      userId
    };

    // For now, just return the created mood
    // Later, you can save to database
    res.status(201).json({
      success: true,
      data: newMood
    });
  } catch (error) {
    console.error('Error creating mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get mood statistics
router.get('/stats', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    // Mock statistics
    const stats = {
      totalEntries: 15,
      averageIntensity: 7.2,
      mostCommonMood: 'happy',
      moodDistribution: {
        happy: 8,
        calm: 4,
        neutral: 2,
        sad: 1
      },
      weeklyTrend: [7, 8, 6, 9, 7, 8, 7]
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching mood stats:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update a mood entry
router.put('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;
    const { mood, intensity, notes } = req.body;

    // Validate input
    if (!mood || !intensity) {
      return res.status(400).json({ 
        success: false, 
        error: 'Mood and intensity are required' 
      });
    }

    if (intensity < 1 || intensity > 10) {
      return res.status(400).json({ 
        success: false, 
        error: 'Intensity must be between 1 and 10' 
      });
    }

    // Mock update - in real app, update database
    const updatedMood = {
      id,
      mood,
      intensity: parseInt(intensity),
      notes: notes || '',
      date: new Date().toISOString(),
      userId
    };

    res.json({
      success: true,
      data: updatedMood
    });
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a mood entry
router.delete('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    // Mock delete - in real app, delete from database
    res.json({
      success: true,
      message: 'Mood entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get mood history with pagination
router.get('/history', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { page = 1, limit = 10 } = req.query;

    // Mock paginated history
    const mockHistory = Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      mood: ['happy', 'calm', 'neutral', 'sad', 'excited'][i % 5],
      intensity: Math.floor(Math.random() * 10) + 1,
      notes: `Mood entry ${i + 1}`,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      userId
    }));

    const startIndex = (parseInt(page as string) - 1) * parseInt(limit as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedHistory = mockHistory.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedHistory,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(mockHistory.length / parseInt(limit as string)),
        totalItems: mockHistory.length,
        hasNext: endIndex < mockHistory.length,
        hasPrev: parseInt(page as string) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching mood history:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 