import React from 'react';
import { FiHeart, FiStar, FiZap } from 'react-icons/fi';

const MoodTracker: React.FC = () => {
  const [mood, setMood] = React.useState<'sad' | 'neutral' | 'happy'>('neutral');
  const [note, setNote] = React.useState('');
  const [entries, setEntries] = React.useState<Array<{
    id: string;
    mood: 'sad' | 'neutral' | 'happy';
    note: string;
    date: string;
  }>>([]);

  // Load mood entries from localStorage on component mount
  React.useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      try {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed);
      } catch (error) {
        console.error('Error loading mood entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mood || !note.trim()) {
      alert('Please select a mood and add notes');
      return;
    }
    
    const newEntry = {
      id: Date.now().toString(),
      mood,
      note: note.trim(),
      date: new Date().toISOString()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setNote('');
    setMood('neutral');
    alert('Mood logged successfully!');
  };

  const handleDeleteMood = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getMoodIcon = (moodType: 'sad' | 'neutral' | 'happy') => {
    switch (moodType) {
      case 'happy':
        return <FiHeart className="w-6 h-6 text-green-500" />;
      case 'neutral':
        return <FiStar className="w-6 h-6 text-yellow-500" />;
      case 'sad':
        return <FiZap className="w-6 h-6 text-blue-500" />;
      default:
        return <FiStar className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getMoodLabel = (moodType: 'sad' | 'neutral' | 'happy') => {
    switch (moodType) {
      case 'happy': return 'Happy';
      case 'neutral': return 'Neutral';
      case 'sad': return 'Sad';
      default: return 'Neutral';
    }
  };

  const getMoodButtonStyle = (moodType: 'sad' | 'neutral' | 'happy') => {
    switch (moodType) {
      case 'happy':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-glow-green';
      case 'neutral':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-glow';
      case 'sad':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-glow';
      default:
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-glow';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gradient bg-gradient-to-r from-success-600 to-primary-600 bg-clip-text text-transparent mb-4">
          Mood Tracker
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Track your daily moods and see how you're feeling over time. Understanding your emotional patterns is the first step to better mental health.
        </p>
      </div>

      {/* Mood Input Form */}
      <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
        <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-8 text-center">
          How are you feeling today?
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Mood Selection */}
          <div>
            <label className="block text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-6 text-center">
              Select your mood:
            </label>
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {(['sad', 'neutral', 'happy'] as const).map((moodType) => (
                <button
                  key={moodType}
                  type="button"
                  onClick={() => setMood(moodType)}
                  className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    mood === moodType
                      ? getMoodButtonStyle(moodType)
                      : 'border-neutral-200 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                  }`}
                >
                  <div className="p-3 rounded-full mb-3">
                    {getMoodIcon(moodType)}
                  </div>
                  <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 text-center">
                    {getMoodLabel(moodType)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label htmlFor="note" className="block text-lg font-semibold text-neutral-700 dark:text-neutral-300 mb-4 text-center">
              Add notes about your mood:
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="input text-center text-lg"
              placeholder="How are you feeling? What's on your mind? What made you feel this way?"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-success w-full py-4 text-lg font-bold shadow-glow-green hover:shadow-glow-lg transform hover:scale-105 active:scale-95"
          >
            Log My Mood
          </button>
        </form>
      </div>

      {/* Mood History */}
      <div className="card p-8 group hover:shadow-soft-lg transition-all duration-300">
        <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-8 text-center">
          Your Mood History
        </h2>
        
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
            </div>
            <h3 className="text-2xl font-semibold text-neutral-500 dark:text-neutral-400 mb-3">No mood entries yet</h3>
            <p className="text-neutral-400 dark:text-neutral-500 text-lg">Start tracking your mood to see your emotional journey here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="card-glass p-6 group hover:shadow-soft transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-800">
                      {getMoodIcon(entry.mood)}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                        {getMoodLabel(entry.mood)} Mood
                      </h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                      </p>
                      {entry.note && (
                        <p className="text-neutral-600 dark:text-neutral-300 mt-2 text-base leading-relaxed">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteMood(entry.id)}
                    className="p-3 rounded-2xl text-error-500 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-300 transform hover:scale-110"
                    title="Delete entry"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker; 