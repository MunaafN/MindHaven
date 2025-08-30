import React, { useState, useEffect } from 'react';
import { FiBookOpen, FiPlus, FiEdit3, FiTrash2, FiCalendar, FiHeart } from 'react-icons/fi';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  date: string;
}

const Journal: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [tags, setTags] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch journal entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/journal');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setLoading(true);
      const entryData = {
        title: title.trim(),
        content: content.trim(),
        mood,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (isEditing) {
        // Update existing entry
        const response = await fetch(`http://localhost:5000/journal/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });

        if (response.ok) {
          const updatedEntry = await response.json();
          setEntries(entries.map(entry => 
            entry.id === editingId ? updatedEntry.data : entry
          ));
          setIsEditing(false);
          setEditingId('');
        }
      } else {
        // Create new entry
        const response = await fetch('http://localhost:5000/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entryData)
        });

        if (response.ok) {
          const newEntry = await response.json();
          setEntries([newEntry.data, ...entries]);
        }
      }

      // Reset form
      setTitle('');
      setContent('');
      setMood('neutral');
      setTags('');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setIsEditing(true);
    setEditingId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags.join(', '));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/journal/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEntries(entries.filter(entry => entry.id !== id));
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId('');
    setTitle('');
    setContent('');
    setMood('neutral');
    setTags('');
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😢';
      case 'excited': return '🤩';
      case 'calm': return '😌';
      case 'anxious': return '😰';
      default: return '😐';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'sad': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'excited': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'calm': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'anxious': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Journal
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Reflect, grow, and track your mental wellness journey
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setTabValue(0)}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-200 ${
                tabValue === 0 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              My Journal
            </button>
            <button
              onClick={() => setTabValue(1)}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-200 ${
                tabValue === 1 
                  ? 'bg-primary-600 text-white' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Community Journals
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {tabValue === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Write New Entry */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                <FiPlus className="w-5 h-5" />
                {isEditing ? 'Edit Entry' : 'Write New Entry'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                    placeholder="Give your entry a title..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="input min-h-[120px] resize-none"
                    placeholder="Write your thoughts, feelings, or experiences here..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">Mood</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="input"
                  >
                    <option value="neutral">😐 Neutral</option>
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😢 Sad</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="calm">😌 Calm</option>
                    <option value="anxious">😰 Anxious</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-2 font-medium">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="input"
                    placeholder="e.g., work, stress, gratitude, family"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (isEditing ? 'Update Entry' : 'Save Entry')}
                  </button>
                  
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Recent Entries */}
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4 flex items-center gap-2">
                <FiBookOpen className="w-5 h-5" />
                Recent Entries
              </h3>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8">
                  <FiBookOpen className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                  <p className="text-neutral-500 dark:text-neutral-400">No journal entries yet. Start writing to see them here!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-neutral-800 dark:text-neutral-200 text-lg break-words">
                          {entry.title}
                        </h4>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-3 line-clamp-3 break-words">
                        {entry.content}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
                            {getMoodIcon(entry.mood)} {entry.mood}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiCalendar className="w-3 h-3" />
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {entry.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FiHeart className="w-3 h-3" />
                            <span className="truncate max-w-20">{entry.tags.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Community Journals</h3>
            <div className="text-center py-12">
              <FiBookOpen className="w-16 h-16 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-2">Community features coming soon!</p>
              <p className="text-neutral-400 dark:text-neutral-500">Share and discover inspiring journal entries from the MindHaven community.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal; 