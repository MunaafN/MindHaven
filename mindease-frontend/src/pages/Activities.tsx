import { FiStar, FiAlertCircle, FiCheckCircle, FiClock, FiTarget } from 'react-icons/fi';
import React, { useState, useEffect, useRef } from 'react';

const activitySuggestions = [
  {
    id: 1,
    title: 'Body Scan Meditation',
    description: 'A guided meditation to help you connect with your body and release tension.',
    type: 'meditation',
    duration: 10
  },
  {
    id: 2,
    title: 'Gratitude Walk',
    description: "Take a mindful walk while focusing on things you're grateful for.",
    type: 'gratitude',
    duration: 15
  },
  {
    id: 3,
    title: 'Box Breathing',
    description: 'A breathing technique to reduce stress: inhale, hold, exhale, hold, each for 4 seconds.',
    type: 'breathing',
    duration: 5
  },
  {
    id: 4,
    title: 'Progressive Muscle Relaxation',
    description: 'Tense and then release each muscle group to achieve deep relaxation.',
    type: 'relaxation',
    duration: 15
  },
  {
    id: 5,
    title: 'Gentle Yoga',
    description: 'Simple stretches and yoga poses to improve flexibility and mindfulness.',
    type: 'exercise',
    duration: 20
  },
  {
    id: 6,
    title: 'Visualization',
    description: 'Visualize a peaceful place or successful outcome to reduce anxiety.',
    type: 'mindfulness',
    duration: 10
  }
];

const Activities: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('meditation');
  const [duration, setDuration] = useState('15');
  const [showCompleted, setShowCompleted] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);

  const [highlightedActivity, setHighlightedActivity] = useState<string | null>(null);
  const [flashingActivity, setFlashingActivity] = useState<string | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render key
  const [renderKey, setRenderKey] = useState(0); // Additional render trigger
  const activitiesRef = useRef<any[]>([]); // Ref to store current activities

  // Update ref whenever activities change
  useEffect(() => {
    activitiesRef.current = activities;
  }, [activities]);

  // Filter activities by completion status
  const activeActivities = activities.filter(activity => !activity.completed);
  const completedActivities = activities.filter(activity => activity.completed);
  
  // Debug logging to see what's happening
  console.log('All activities:', activities);
  console.log('Active activities:', activeActivities);
  console.log('Completed activities:', completedActivities);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:5000/activities');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setActivities(data);
            if (data.filter((activity: any) => !activity.completed).length === 0 && 
                data.filter((activity: any) => activity.completed).length > 0) {
              setShowCompleted(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!title.trim() || !description.trim() || !type || !duration) {
      alert('Please fill in all fields');
      return;
    }
    
    const durationNum = Number(duration);
    
    if (durationNum <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    // Check for duplicate activity
    const isDuplicate = activities.some(
      activity => 
        activity.title.toLowerCase() === title.toLowerCase() && 
        activity.description.toLowerCase() === description.toLowerCase() &&
        activity.type === type &&
        Number(activity.duration) === durationNum
    );

    if (isDuplicate) {
      alert('This activity already exists');
      return;
    }
    
    // Create the new activity object
    const newActivity = {
      id: `temp_${Date.now()}`, // Temporary ID
      title: title.trim(),
      description: description.trim(),
      type,
      duration: durationNum,
      completed: false,
      date: new Date().toISOString(),
      userId: 'mock-user-123'
    };

    // OPTIMISTIC UPDATE: Add to UI immediately (add to beginning of list for better visibility)
    console.log('Adding new activity:', newActivity);
    
    // Use a more explicit state update to ensure React re-renders
    setActivities(prevActivities => {
      const newActivities = [newActivity, ...prevActivities];
      console.log('Updated activities array:', newActivities);
      
      // Schedule verification after state update
      setTimeout(() => {
        console.log('Verifying activity was added...');
        const currentActivities = newActivities; // Use the new activities directly
        console.log('Current activities after adding:', currentActivities);
        console.log('Current active activities after adding:', currentActivities.filter((a: any) => !a.completed));
        
        const found = currentActivities.find((a: any) => a.id === newActivity.id);
        console.log('Found new activity in array:', found);
        if (!found) {
          console.error('New activity not found in array!');
        } else {
          console.log('✅ Activity successfully added and verified!');
        }
      }, 100);
      
      return newActivities;
    });
    
    // Also update the ref immediately to ensure it's available for debugging
    activitiesRef.current = [newActivity, ...activitiesRef.current];
    
    // Force immediate re-render by updating multiple state variables
    setForceUpdate(prev => prev + 1);
    setRenderKey(prev => prev + 1);
    
    // Additional immediate re-render trigger
    setTimeout(() => {
      setRenderKey(prev => prev + 1);
    }, 10);
    
    // Use React's flushSync to ensure immediate update (if available)
    if (typeof window !== 'undefined' && (window as any).React) {
      try {
        const { flushSync } = (window as any).React;
        if (flushSync) {
          flushSync(() => {
            setRenderKey(prev => prev + 1);
          });
        }
      } catch (e) {
        // flushSync not available, continue with normal approach
      }
    }
    
    // Highlight the newly added activity
    setHighlightedActivity(newActivity.id);
    
    // Add flash effect for extra visibility
    setFlashingActivity(newActivity.id);
    
    // Clear form immediately for better UX
    setTitle('');
    setDescription('');
    setType('meditation');
    setDuration('15');
    
    // Show success message immediately
    alert(`Activity "${newActivity.title}" added successfully!`);
    
    // Force a re-render to ensure the new activity is visible
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 100);
    

    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      setHighlightedActivity(null);
    }, 3000);
    
    // Remove flash effect after 1 second
    setTimeout(() => {
      setFlashingActivity(null);
    }, 1000);
    
    // Scroll to the newly added activity to make it visible
    setTimeout(() => {
      const activityElement = document.querySelector(`[data-activity-id="${newActivity.id}"]`);
      if (activityElement) {
        activityElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
    // Make backend request in background
    try {
      const response = await fetch('http://localhost:5000/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newActivity.title,
          description: newActivity.description,
          type: newActivity.type,
          duration: newActivity.duration,
          completed: false,
          date: newActivity.date
        })
      });
      
      if (response.ok) {
        const addedActivity = await response.json();
        // Update with real backend data (replace temp ID with real one)
        setActivities(prev => prev.map(activity => 
          activity.id === newActivity.id ? { ...addedActivity, id: addedActivity.id } : activity
        ));
      } else {
        // If backend fails, remove the optimistically added activity
        setActivities(prev => prev.filter(activity => activity.id !== newActivity.id));
        alert('Failed to save activity to server. Please try again.');
        // Restore form data
        setTitle(newActivity.title);
        setDescription(newActivity.description);
        setType(newActivity.type);
        setDuration(newActivity.duration.toString());
      }
    } catch (error: any) {
      console.error('Error adding activity:', error);
      // If network error, remove the optimistically added activity
      setActivities(prev => prev.filter(activity => activity.id !== newActivity.id));
      alert('Network error. Failed to save activity. Please try again.');
      // Restore form data
        setTitle(newActivity.title);
        setDescription(newActivity.description);
        setType(newActivity.type);
        setDuration(newActivity.duration.toString());
    }
  };

  const handleToggle = async (id: string) => {
    // Find the current activity
    const currentActivity = activities.find(activity => activity.id === id);
    if (!currentActivity) return;

    console.log('Toggling activity:', id, 'from completed:', currentActivity.completed, 'to:', !currentActivity.completed);

    // OPTIMISTIC UPDATE: Toggle immediately in UI
    const updatedActivity = { ...currentActivity, completed: !currentActivity.completed };
    
    setActivities(prevActivities => {
      const newActivities = prevActivities.map(activity => 
        activity.id === id ? updatedActivity : activity
      );
      console.log('Updated activities after toggle:', newActivities);
      return newActivities;
    });
    
    // Also update the force update to ensure immediate re-render
    setForceUpdate(prev => prev + 1);
    setRenderKey(prev => prev + 1);
    
    // If marking as complete, automatically switch to completed view
    if (!currentActivity.completed) {
      setShowCompleted(true);
      // Show a brief success message
      setTimeout(() => {
        alert('Activity marked complete! Switched to completed view.');
      }, 100);
    }
    
    // Force a re-render to ensure the toggle is immediately visible
    setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 50);
    
    // Make backend request in background
    try {
      const response = await fetch(`http://localhost:5000/activities/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const serverUpdatedActivity = await response.json();
        // Update with real backend data
        setActivities(prev => prev.map(activity => 
          activity.id === id ? serverUpdatedActivity : activity
        ));
        
        // Update progress on the backend
        try {
          await fetch('http://localhost:5000/progress/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activityCompleted: true })
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      } else {
        // If backend fails, revert the optimistic update
        setActivities(prev => prev.map(activity => 
          activity.id === id ? currentActivity : activity
        ));
        // Also revert the view change
        if (!currentActivity.completed) {
          setShowCompleted(false);
        }
        alert('Failed to update activity. Please try again.');
      }
    } catch (error: any) {
      console.error('Toggle activity error:', error);
      // If network error, revert the optimistic update
      setActivities(prev => prev.map(activity => 
        activity.id === id ? currentActivity : activity
      ));
      // Also revert the view change
      if (!currentActivity.completed) {
        setShowCompleted(false);
      }
      alert('Network error. Failed to update activity. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    // Find the activity to delete
    const activityToDelete = activities.find(activity => activity.id === id);
    if (!activityToDelete) return;

    // OPTIMISTIC UPDATE: Remove immediately from UI
    setActivities(prev => prev.filter(activity => activity.id !== id));
    
    // Make backend request in background
    try {
      const response = await fetch(`http://localhost:5000/activities/${id}`, {
        method: 'DELETE'
      });
      
      if (response.status === 200) {
        // Update progress on the backend
        try {
          await fetch('http://localhost:5000/progress/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activityCompleted: false })
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      } else {
        // If backend fails, restore the deleted activity
        setActivities(prev => [...prev, activityToDelete]);
        alert('Failed to delete activity. Please try again.');
      }
    } catch (error: any) {
      console.error('Delete activity error:', error);
      // If network error, restore the deleted activity
      setActivities(prev => [...prev, activityToDelete]);
      alert('Network error. Failed to delete activity. Please try again.');
    }
  };

  const handleTrySuggestion = (suggestion: any) => {
    setTitle(suggestion.title);
    setDescription(suggestion.description);
    setType(suggestion.type);
    setDuration(suggestion.duration.toString());
    // Scroll to the form
    document.getElementById('activity-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleCompletedView = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <div key={`${forceUpdate}-${renderKey}`} className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Daily Activities
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Activity Form */}
          <div className="card p-6" id="activity-form">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-800 dark:text-neutral-200">Add New Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-3 font-medium">Title</label>
                <input
                  type="text"
                  className="input w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter activity title"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-3 font-medium">Description</label>
                <textarea
                  className="input w-full min-h-[120px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your activity"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-3 font-medium">Type</label>
                <select
                  className="input w-full"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="meditation">Meditation</option>
                  <option value="exercise">Exercise</option>
                  <option value="gratitude">Gratitude</option>
                  <option value="breathing">Breathing</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="journaling">Journaling</option>
                  <option value="yoga">Yoga</option>
                  <option value="stretching">Stretching</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-3 font-medium">Duration (minutes)</label>
                <input
                  type="number"
                  className="input w-full"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full py-3 text-lg font-semibold"
              >
                Add Activity
              </button>
            </form>
          </div>

                     {/* Activities List */}
           <div key={`activities-${renderKey}`} className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-200">
                {showCompleted ? "Completed Activities" : "Today's Activities"}
              </h2>
                             <button
                 onClick={toggleCompletedView}
                 className="px-4 py-2 text-sm bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 dark:from-slate-700 dark:to-blue-900/30 dark:hover:from-slate-600 dark:hover:to-blue-800/40 rounded-lg transition-all duration-300 font-medium text-slate-700 dark:text-slate-200 hover:shadow-md border border-slate-200 dark:border-slate-600"
               >
                 {showCompleted ? "Show Active" : "Show Completed"}
               </button>
            </div>
            
            {showCompleted ? (
              completedActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <FiCheckCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                  <p className="text-neutral-500 dark:text-neutral-400 text-lg">No completed activities yet</p>
                  <p className="text-neutral-400 dark:text-neutral-500 text-base">Complete some activities to see them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedActivities.map((activity) => (
                                         <div
                       key={activity.id}
                       className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 hover:shadow-lg transition-all duration-300"
                     >
                       <div className="flex justify-between items-start gap-4">
                         <div className="flex-1 min-w-0">
                           <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-lg mb-2 flex items-center break-words">
                             <FiCheckCircle className="text-emerald-500 mr-3 flex-shrink-0" /> 
                             {activity.title}
                           </h3>
                           <p className="text-emerald-700 dark:text-emerald-300 text-base mb-3 leading-relaxed break-words">
                             {activity.description}
                           </p>
                           <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg text-sm font-medium border border-emerald-200 dark:border-emerald-800">
                               <FiTarget className="mr-2 text-emerald-500" /> {activity.type}
                             </span>
                             <span className="inline-flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg text-sm font-medium border border-green-200 dark:border-green-800">
                               <FiClock className="mr-2 text-green-500" /> {activity.duration} min
                             </span>
                           </div>
                         </div>
                         <button
                           onClick={() => handleDelete(activity.id.toString())}
                           className="px-4 py-2 rounded-lg flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium flex-shrink-0 border border-red-200 dark:border-red-800 hover:shadow-md"
                         >
                           Delete
                         </button>
                       </div>
                     </div>
                  ))}
                </div>
              )
            ) : (
              activeActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <FiAlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
                  <p className="text-neutral-500 dark:text-neutral-400 text-lg">No active activities</p>
                  <p className="text-neutral-400 dark:text-neutral-500 text-base">Add some activities to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeActivities.map((activity) => (
                                                                 <div
                          key={activity.id}
                          data-activity-id={activity.id}
                          className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                            highlightedActivity === activity.id
                              ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-600 shadow-lg ring-2 ring-green-200 dark:ring-green-700'
                              : flashingActivity === activity.id
                              ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-300 dark:border-yellow-600 shadow-lg ring-2 ring-yellow-200 dark:ring-yellow-700 animate-pulse'
                              : 'bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                       <div className="flex justify-between items-start gap-4">
                                                   <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg break-words">
                                {activity.title}
                              </h3>
                              {highlightedActivity === activity.id && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">
                                  New
                                </span>
                              )}
                            </div>
                           <p className="text-slate-600 dark:text-slate-400 text-base mb-3 leading-relaxed break-words">
                             {activity.description}
                           </p>
                           <div className="flex flex-wrap gap-2">
                             <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800">
                               <FiTarget className="mr-2 text-blue-500" /> {activity.type}
                             </span>
                             <span className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-lg text-sm font-medium border border-indigo-200 dark:border-indigo-800">
                               <FiClock className="mr-2 text-indigo-500" /> {activity.duration} min
                             </span>
                           </div>
                         </div>
                         <div className="flex gap-2 flex-shrink-0">
                           <button
                             onClick={() => handleToggle(activity.id.toString())}
                             className="px-4 py-2 rounded-lg flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all duration-300 font-medium border border-emerald-200 dark:border-emerald-800 hover:shadow-md"
                           >
                             Mark Complete
                           </button>
                           <button
                             onClick={() => handleDelete(activity.id.toString())}
                             className="px-4 py-2 rounded-lg flex items-center bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium border border-red-200 dark:border-red-800 hover:shadow-md"
                           >
                             Delete
                           </button>
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="card p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Today's Progress</h2>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
              <FiStar className="mr-2 text-yellow-500" />
              <span>
                {activities.filter((a) => a.completed).length} / {activities.length} completed
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
              style={{
                width: activities.length ? `${(activities.filter((a) => a.completed).length / activities.length) * 100}%` : '0%',
              }}
            ></div>
          </div>
        </div>

                 {/* Activity Suggestions */}
         <div className="card p-6 bg-gradient-to-r from-slate-50 to-purple-50 dark:from-slate-800/50 dark:to-purple-900/20 border border-slate-200 dark:border-slate-700">
           <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">Suggested Activities</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {activitySuggestions.map(suggestion => (
               <div key={suggestion.id} className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group">
                 <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-lg mb-3 break-words">
                   {suggestion.title}
                 </h3>
                 <p className="text-slate-600 dark:text-slate-400 text-base mb-4 leading-relaxed break-words">
                   {suggestion.description}
                 </p>
                 <div className="flex gap-2 mb-4">
                   <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-800">
                     {suggestion.type}
                   </span>
                   <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-800">
                     {suggestion.duration} min
                   </span>
                 </div>
                 <button 
                   onClick={() => handleTrySuggestion(suggestion)}
                   className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                 >
                   Try this activity
                 </button>
               </div>
             ))}
           </div>
         </div>
      </div>
    </div>
  );
};

export default Activities; 