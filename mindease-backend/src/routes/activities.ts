import express from 'express';
// import { Activity } from '../models/Activity'; // Model doesn't exist, using mock data
// import { protect } from '../middleware/auth'; // Temporarily removed for functionality

const router = express.Router();

// Mock user ID for now - can be replaced with real auth later
const MOCK_USER_ID = 'mock-user-123';

// Mock activities data for now
let activities: any[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start the day with 10 minutes of mindfulness meditation',
    type: 'meditation',
    duration: 10,
    completed: false,
    date: new Date().toISOString(),
    userId: MOCK_USER_ID
  },
  {
    id: '2',
    title: 'Deep Breathing Exercise',
    description: 'Practice box breathing technique for stress relief',
    type: 'breathing',
    duration: 5,
    completed: true,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: MOCK_USER_ID
  }
];

// Get all activities for a user
router.get('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    const userActivities = activities.filter(activity => activity.userId === userId);
    res.json(userActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { title, description, type, duration } = req.body;

    // Validate input
    if (!title || !description || !type || !duration) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, description, type, and duration are required' 
      });
    }

    // Create new activity
    const newActivity = {
      id: Date.now().toString(),
      title,
      description,
      type,
      duration: parseInt(duration),
      completed: false,
      date: new Date().toISOString(),
      userId
    };

    activities.push(newActivity);
    
    res.status(201).json({
      success: true,
      data: newActivity
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get a specific activity
router.get('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    const activity = activities.find(a => a.id === id && a.userId === userId);
    
    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        error: 'Activity not found' 
      });
    }

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update an activity
router.put('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;
    const { title, description, type, duration, completed } = req.body;

    // Validate input
    if (!title || !description || !type || !duration) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, description, type, and duration are required' 
      });
    }

    const activityIndex = activities.findIndex(a => a.id === id && a.userId === userId);
    
    if (activityIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Activity not found' 
      });
    }

    // Update the activity
    activities[activityIndex] = {
      ...activities[activityIndex],
      title,
      description,
      type,
      duration: parseInt(duration),
      completed: completed !== undefined ? completed : activities[activityIndex].completed,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: activities[activityIndex]
    });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Toggle activity completion status
router.put('/:id/toggle', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    const activityIndex = activities.findIndex(a => a.id === id && a.userId === userId);
    
    if (activityIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Activity not found' 
      });
    }

    // Toggle completion status
    activities[activityIndex].completed = !activities[activityIndex].completed;
    activities[activityIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: activities[activityIndex]
    });
  } catch (error) {
    console.error('Error toggling activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete an activity
router.delete('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    const activityIndex = activities.findIndex(a => a.id === id && a.userId === userId);
    
    if (activityIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Activity not found' 
      });
    }

    activities.splice(activityIndex, 1);

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get activities by type
router.get('/type/:type', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { type } = req.params;

    const filteredActivities = activities.filter(
      activity => activity.userId === userId && activity.type === type
    );

    res.json(filteredActivities);
  } catch (error) {
    console.error('Error fetching activities by type:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get completed activities
router.get('/completed', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now

    const completedActivities = activities.filter(
      activity => activity.userId === userId && activity.completed
    );

    res.json(completedActivities);
  } catch (error) {
    console.error('Error fetching completed activities:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get pending activities
router.get('/pending', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now

    const pendingActivities = activities.filter(
      activity => activity.userId === userId && !activity.completed
    );

    res.json(pendingActivities);
  } catch (error) {
    console.error('Error fetching pending activities:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 