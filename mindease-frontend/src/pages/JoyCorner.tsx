import React, { useState, useEffect } from 'react';
import { FiSmile, FiPlayCircle, FiImage, FiEdit3, FiStar, FiHeart } from 'react-icons/fi';
import MemoryGame from '../components/joy/MemoryGame';
import WordJumble from '../components/joy/WordJumble';
import DrawingCanvas from '../components/joy/DrawingCanvas';
import UpliftingContentComponent from '../components/joy/UpliftingContent';

// Emoji celebration component
const EmojiCelebration = () => {
  const [emojis, setEmojis] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  useEffect(() => {
    const celebrationEmojis = ['😊', '🎉', '✨', '🌟', '💖', '🎈', '🎊', '🌈', '💫', '🎁'];
    const newEmojis = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setEmojis(newEmojis);

    // Cleanup after animation
    const timer = setTimeout(() => {
      setEmojis([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {emojis.map(({ id, emoji, x, y }) => (
        <div
          key={id}
          className="absolute animate-float"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animation: `float ${1 + Math.random() * 2}s ease-out forwards`
          }}
        >
          <span className="text-2xl">{emoji}</span>
        </div>
      ))}
    </div>
  );
};

// Add this CSS to your global styles or component
const styles = `
@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
}

@keyframes star-spin {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.3) rotate(180deg);
  }
  100% {
    transform: scale(1.25) rotate(360deg);
  }
}

@keyframes heart-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.25);
  }
}

@keyframes smile-bounce {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.2);
  }
  75% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.25);
  }
}

.animate-star-spin {
  animation: star-spin 1s ease-in-out forwards;
}

.animate-heart-beat {
  animation: heart-beat 1s ease-in-out forwards;
}

.animate-smile-bounce {
  animation: smile-bounce 1s ease-in-out forwards;
}
`;

// Sub-components for different tabs
const MiniGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
  };

  const handleBackToList = () => {
    setSelectedGame(null);
  };

  // If a game is selected, render it
  if (selectedGame === 'memory') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Games
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Memory Match Game</h2>
        </div>
        <MemoryGame />
      </div>
    );
  }

  if (selectedGame === 'wordjumble') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Games
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Word Jumble</h2>
        </div>
        <WordJumble />
      </div>
    );
  }

  // Game selection list
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Game</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          onClick={() => handleGameSelect('memory')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FiPlayCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Memory Match</h3>
            <p className="text-gray-600 dark:text-gray-400">Test your memory with this fun card matching game!</p>
          </div>
        </div>

        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          onClick={() => handleGameSelect('wordjumble')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FiEdit3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Word Jumble</h3>
            <p className="text-gray-600 dark:text-gray-400">Unscramble words and boost your vocabulary!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CreativeCorner = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleToolSelect = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleBackToList = () => {
    setSelectedTool(null);
  };

  if (selectedTool === 'drawing') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Tools
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Canvas</h2>
        </div>
        <DrawingCanvas />
      </div>
    );
  }

  if (selectedTool === 'uplifting') {
    return (
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <button 
            onClick={handleBackToList}
            className="btn btn-outline btn-sm mr-4"
          >
            ← Back to Tools
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Uplifting Content</h2>
        </div>
        <UpliftingContentComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Creative Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          onClick={() => handleToolSelect('drawing')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FiImage className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Digital Canvas</h3>
            <p className="text-gray-600 dark:text-gray-400">Express yourself through digital art and drawing!</p>
          </div>
        </div>

        <div 
          className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
          onClick={() => handleToolSelect('uplifting')}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <FiStar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Uplifting Content</h3>
            <p className="text-gray-600 dark:text-gray-400">Discover inspiring quotes and positive content!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const JoyCorner: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [starAnimation, setStarAnimation] = useState(false);
  const [heartAnimation, setHeartAnimation] = useState(false);
  const [smileAnimation, setSmileAnimation] = useState(false);

  const handleTabChange = (newValue: number) => {
    setActiveTab(newValue);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const triggerStarAnimation = () => {
    setStarAnimation(true);
    setTimeout(() => setStarAnimation(false), 1000);
  };

  const triggerHeartAnimation = () => {
    setHeartAnimation(true);
    setTimeout(() => setHeartAnimation(false), 1000);
  };

  const triggerSmileAnimation = () => {
    setSmileAnimation(true);
    setTimeout(() => setSmileAnimation(false), 1000);
  };

  const tabs = [
    { label: 'Mini Games', icon: FiPlayCircle },
    { label: 'Creative Corner', icon: FiImage },
    { label: 'Daily Joy', icon: FiSmile }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Joy Corner
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-lg">
            Take a break and have some fun! Boost your mood with games, creativity, and daily joy.
          </p>
        </div>

        {/* Celebration Trigger */}
        <div className="text-center">
          <button
            onClick={triggerCelebration}
            className="btn btn-accent px-8 py-3 text-lg font-semibold"
          >
            🎉 Celebrate Your Day! 🎉
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
          <div className="flex space-x-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => handleTabChange(index)}
                className={`px-6 py-3 font-semibold rounded-t-lg transition-all duration-200 flex items-center gap-2 ${
                  activeTab === index 
                    ? 'bg-primary-600 text-white' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="card p-8">
          {activeTab === 0 && <MiniGames />}
          {activeTab === 1 && <CreativeCorner />}
          {activeTab === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Daily Joy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300" onClick={triggerStarAnimation}>
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiStar className={`w-8 h-8 text-white transition-all duration-300 ${starAnimation ? 'animate-star-spin scale-125' : ''}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Gratitude Practice</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Write down three things you're grateful for today.</p>
                </div>

                <div className="card p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300" onClick={triggerHeartAnimation}>
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className={`w-8 h-8 text-white transition-all duration-300 ${heartAnimation ? 'animate-heart-beat scale-125' : ''}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Random Act of Kindness</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Do something nice for someone else today.</p>
                </div>

                <div className="card p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-300" onClick={triggerSmileAnimation}>
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiSmile className={`w-8 h-8 text-white transition-all duration-300 ${smileAnimation ? 'animate-smile-bounce scale-125' : ''}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Smile Challenge</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Smile at three people today and notice their reactions.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emoji Celebration */}
      {showCelebration && <EmojiCelebration />}
      
      {/* Inline styles for animations */}
      <style>{styles}</style>
    </div>
  );
};

export default JoyCorner;