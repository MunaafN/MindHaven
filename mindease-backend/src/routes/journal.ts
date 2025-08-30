import express from 'express';
import Journal from '../models/journal';
// import { protect } from '../middleware/auth'; // Temporarily removed for functionality

const router = express.Router();

// Mock user ID for now - can be replaced with real auth later
const MOCK_USER_ID = 'mock-user-123';

// Mock journal entries for now
let journalEntries: any[] = [
  {
    id: '1',
    title: 'My First Journal Entry',
    content: 'Today I felt really good about myself. I accomplished a lot and felt productive.',
    mood: 'happy',
    tags: ['productivity', 'self-esteem'],
    date: new Date().toISOString(),
    userId: MOCK_USER_ID
  },
  {
    id: '2',
    title: 'Reflection on Challenges',
    content: 'Facing some difficulties at work, but I\'m learning to handle stress better.',
    mood: 'neutral',
    tags: ['work', 'stress-management'],
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    userId: MOCK_USER_ID
  }
];

// Get all journal entries for a user
router.get('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    
    const userEntries = journalEntries.filter(entry => entry.userId === userId);
    res.json(userEntries);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create a new journal entry
router.post('/', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { title, content, mood, tags } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and content are required' 
      });
    }

    // Create new journal entry
    const newEntry = {
      id: Date.now().toString(),
      title,
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      date: new Date().toISOString(),
      userId
    };

    journalEntries.push(newEntry);
    
    res.status(201).json({
      success: true,
      data: newEntry
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get a specific journal entry
router.get('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    const entry = journalEntries.find(e => e.id === id && e.userId === userId);
    
    if (!entry) {
      return res.status(404).json({ 
        success: false, 
        error: 'Journal entry not found' 
      });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Update a journal entry
router.put('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;
    const { title, content, mood, tags } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title and content are required' 
      });
    }

    const entryIndex = journalEntries.findIndex(e => e.id === id && e.userId === userId);
    
    if (entryIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Journal entry not found' 
      });
    }

    // Update the entry
    journalEntries[entryIndex] = {
      ...journalEntries[entryIndex],
      title,
      content,
      mood: mood || 'neutral',
      tags: tags || [],
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: journalEntries[entryIndex]
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete a journal entry
router.delete('/:id', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { id } = req.params;

    const entryIndex = journalEntries.findIndex(e => e.id === id && e.userId === userId);
    
    if (entryIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Journal entry not found' 
      });
    }

    journalEntries.splice(entryIndex, 1);

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get journal entries by mood
router.get('/mood/:mood', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { mood } = req.params;

    const filteredEntries = journalEntries.filter(
      entry => entry.userId === userId && entry.mood === mood
    );

    res.json(filteredEntries);
  } catch (error) {
    console.error('Error fetching journal entries by mood:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get journal entries by tag
router.get('/tag/:tag', async (req, res) => {
  try {
    // const userId = (req as any).user.id; // Temporarily commented out
    const userId = MOCK_USER_ID; // Using mock user ID for now
    const { tag } = req.params;

    const filteredEntries = journalEntries.filter(
      entry => entry.userId === userId && entry.tags.includes(tag)
    );

    res.json(filteredEntries);
  } catch (error) {
    console.error('Error fetching journal entries by tag:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router; 