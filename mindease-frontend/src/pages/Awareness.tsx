import React, { useState } from 'react';
import { FiInfo, FiBookOpen, FiBriefcase, FiUsers, FiHeart, FiExternalLink } from 'react-icons/fi';

interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'article' | 'video' | 'organization' | 'app';
}

interface MentalHealthCondition {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  coping: string[];
  expanded: boolean;
}

const Awareness: React.FC = () => {
  // Mental health conditions with information
  const [conditions, setConditions] = useState<MentalHealthCondition[]>([
    {
      id: '1',
      name: 'Anxiety Disorders',
      description: 'Anxiety disorders are characterized by excessive fear or worry that interferes with daily activities. They are among the most common mental health conditions.',
      symptoms: [
        'Excessive worry or fear',
        'Feeling restless or on-edge',
        'Rapid heart rate and breathing',
        'Difficulty concentrating',
        'Sleep problems',
        'Avoidance of anxiety-triggering situations'
      ],
      coping: [
        'Practice deep breathing and mindfulness meditation',
        'Regular physical exercise',
        'Maintain a regular sleep schedule',
        'Consider cognitive behavioral therapy (CBT)',
        'In some cases, medication may be prescribed by a doctor'
      ],
      expanded: false
    },
    {
      id: '2',
      name: 'Depression',
      description: 'Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. It affects how you feel, think and behave and can lead to a variety of emotional and physical problems.',
      symptoms: [
        'Persistent sad, anxious, or "empty" mood',
        'Loss of interest in activities once enjoyed',
        'Decreased energy or fatigue',
        'Difficulty sleeping or oversleeping',
        'Changes in appetite or weight',
        'Thoughts of death or suicide'
      ],
      coping: [
        'Regular exercise and outdoor activities',
        'Maintain social connections',
        'Establish a routine and set achievable goals',
        'Psychotherapy (talk therapy)',
        'Medication when prescribed by a healthcare provider'
      ],
      expanded: false
    },
    {
      id: '3',
      name: 'Post-Traumatic Stress Disorder (PTSD)',
      description: 'PTSD is a disorder that develops in some people who have experienced a shocking, scary, or dangerous event. It can cause intense, disturbing thoughts and feelings related to the experience that last long after the traumatic event has ended.',
      symptoms: [
        'Intrusive memories or flashbacks of the traumatic event',
        'Nightmares related to the trauma',
        'Severe emotional distress when reminded of the event',
        'Avoidance of situations that remind you of the event',
        'Negative changes in thinking and mood',
        'Changes in physical and emotional reactions'
      ],
      coping: [
        'Trauma-focused cognitive behavioral therapy',
        'Eye Movement Desensitization and Reprocessing (EMDR)',
        'Support groups with others who have experienced similar traumas',
        'Self-care practices like meditation and physical exercise',
        'Medication when prescribed by a healthcare provider'
      ],
      expanded: false
    },
    {
      id: '4',
      name: 'Bipolar Disorder',
      description: 'Bipolar disorder causes unusual shifts in mood, energy, activity levels, concentration, and the ability to carry out day-to-day tasks. There are typically periods of abnormally elevated mood (mania) and periods of depression.',
      symptoms: [
        'Manic episodes: increased energy, reduced need for sleep, racing thoughts',
        'Depressive episodes: feeling sad, empty, hopeless, decreased energy',
        'Changes in sleep patterns',
        'Difficulty concentrating and making decisions',
        'Impulsive behavior during manic episodes',
        'Thoughts of death or suicide during depressive episodes'
      ],
      coping: [
        'Mood stabilizing medications as prescribed',
        'Regular therapy sessions',
        'Maintaining a stable daily routine',
        'Tracking mood changes',
        'Getting adequate sleep',
        'Avoiding alcohol and recreational drugs'
      ],
      expanded: false
    }
  ]);

  // Resources for mental health
  const resources: Resource[] = [
    {
      id: '1',
      title: 'National Alliance on Mental Illness (NAMI)',
      description: 'NAMI provides advocacy, education, support and public awareness so that all individuals and families affected by mental illness can build better lives.',
      link: 'https://www.nami.org/',
      category: 'organization'
    },
    {
      id: '2',
      title: 'Mental Health America',
      description: 'Mental Health America is the nation\'s leading community-based nonprofit dedicated to addressing the needs of those living with mental illness.',
      link: 'https://www.mhanational.org/',
      category: 'organization'
    },
    {
      id: '3',
      title: 'Understanding Anxiety and Depression',
      description: 'An in-depth article explaining the causes, symptoms, and treatments for anxiety and depression.',
      link: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
      category: 'article'
    },
    {
      id: '4',
      title: 'Mindfulness Meditation for Beginners',
      description: 'A 15-minute guided meditation video specifically designed for people experiencing anxiety or depression.',
      link: 'https://www.youtube.com/results?search_query=mindfulness+meditation+for+beginners',
      category: 'video'
    },
    {
      id: '5',
      title: 'Headspace',
      description: 'An app that teaches meditation and mindfulness skills to help with stress, anxiety, sleep, and more.',
      link: 'https://www.headspace.com/',
      category: 'app'
    },
    {
      id: '6',
      title: 'Crisis Text Line',
      description: 'Free 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the USA to text with a trained Crisis Counselor.',
      link: 'https://www.crisistextline.org/',
      category: 'organization'
    }
  ];

  // Toggle expanded state for conditions
  const toggleExpanded = (id: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id 
        ? { ...condition, expanded: !condition.expanded } 
        : condition
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-primary-950 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
            Mental Health Awareness
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto text-lg leading-relaxed">
            Learn about different mental health conditions, their symptoms, and ways to cope. Education is the first step toward understanding and healing.
          </p>
        </div>

        {/* Statistics Card */}
        <div className="card bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white p-6 shadow-lg border border-blue-400 dark:border-blue-600">
          <div className="flex items-center mb-6">
            <FiInfo className="w-6 h-6 mr-3 text-blue-100" />
            <h2 className="text-2xl font-semibold">Mental Health Facts</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl min-h-[120px] flex flex-col justify-center hover:bg-white/30 transition-all duration-300 border border-white/20">
              <p className="text-2xl sm:text-3xl font-bold mb-3 text-blue-50">1 in 5</p>
              <p className="text-sm sm:text-base leading-relaxed px-2 break-words text-blue-100">
                Adults experience mental illness each year
              </p>
            </div>
            <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl min-h-[120px] flex flex-col justify-center hover:bg-white/30 transition-all duration-300 border border-white/20">
              <p className="text-2xl sm:text-3xl font-bold mb-3 text-blue-50">50%</p>
              <p className="text-sm sm:text-base leading-relaxed px-2 break-words text-blue-100">
                Mental health conditions begin by age 14
              </p>
            </div>
            <div className="text-center p-6 bg-white/20 backdrop-blur-sm rounded-xl min-h-[120px] flex flex-col justify-center hover:bg-white/30 transition-all duration-300 border border-white/20">
              <p className="text-2xl sm:text-3xl font-bold mb-3 text-blue-50">300 Million+</p>
              <p className="text-sm sm:text-base leading-relaxed px-2 break-words text-blue-100">
                People worldwide suffer from depression
              </p>
            </div>
          </div>
          <p className="text-sm text-blue-100 text-center px-4 leading-relaxed">
            Source: World Health Organization and National Alliance on Mental Illness
          </p>
        </div>

        {/* Common Mental Health Conditions */}
        <div className="card p-6 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-6">
            <FiBookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Common Mental Health Conditions</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">
            Understanding these conditions can help you identify symptoms in yourself or loved ones and seek appropriate help.
          </p>
          <div className="space-y-6">
            {conditions.map(condition => (
              <div key={condition.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                <button
                  onClick={() => toggleExpanded(condition.id)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/20"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg break-words">
                    {condition.name}
                  </span>
                  <span className={`transform transition-transform text-lg text-blue-600 dark:text-blue-400 ${condition.expanded ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {condition.expanded && (
                  <div className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/30 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-base break-words">
                      {condition.description}
                    </p>
                    
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-lg">Common Symptoms:</h3>
                    <ul className="list-disc pl-6 mb-6 text-slate-600 dark:text-slate-400 space-y-2">
                      {condition.symptoms.map((symptom, index) => (
                        <li key={index} className="leading-relaxed text-base break-words">{symptom}</li>
                      ))}
                    </ul>
                    
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-lg">Coping Strategies:</h3>
                    <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 space-y-2">
                      {condition.coping.map((strategy, index) => (
                        <li key={index} className="leading-relaxed text-base break-words">{strategy}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Self-Care Tips */}
        <div className="card p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center mb-6">
            <FiHeart className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mr-3" />
            <h2 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-200">Self-Care Practices</h2>
          </div>
          <p className="text-emerald-700 dark:text-emerald-300 mb-8 text-lg leading-relaxed">
            Taking care of your mental health is just as important as physical health. Here are some daily practices that can help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-800/50 dark:to-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-lg">Mindfulness Meditation</h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed break-words">
                Practice being present in the moment without judgment. Just 5-10 minutes daily can reduce stress and anxiety.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-800/50 dark:to-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-lg">Physical Exercise</h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed break-words">
                Regular physical activity releases endorphins, which naturally boost mood and reduce stress hormones.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-800/50 dark:to-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-lg">Healthy Sleep Habits</h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed break-words">
                Maintain a regular sleep schedule. Poor sleep can worsen symptoms of many mental health conditions.
              </p>
            </div>
            <div className="p-6 bg-gradient-to-br from-white to-emerald-50 dark:from-emerald-800/50 dark:to-emerald-900/30 rounded-xl border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-3 text-lg">Social Connection</h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-base leading-relaxed break-words">
                Maintain relationships with supportive friends and family. Social isolation can worsen depression and anxiety.
              </p>
            </div>
          </div>
        </div>

        {/* Stigma Reduction */}
        <div className="card p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border border-green-200 dark:border-green-700">
          <div className="flex items-center mb-6">
            <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">Reducing Stigma</h2>
          </div>
          <p className="text-green-700 dark:text-green-300 mb-6 text-lg leading-relaxed">
            Mental health stigma can prevent people from seeking help. Here are ways to combat stigma:
          </p>
          <ul className="space-y-4 text-green-700 dark:text-green-300">
            <li className="flex items-start p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300">
              <span className="mr-3 text-green-600 dark:text-green-400 text-lg font-bold">•</span>
              <span className="leading-relaxed text-base break-words">
                <strong>Talk openly</strong> about mental health to normalize the conversation
              </span>
            </li>
            <li className="flex items-start p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300">
              <span className="mr-3 text-green-600 dark:text-green-400 text-lg font-bold">•</span>
              <span className="leading-relaxed text-base break-words">
                <strong>Educate yourself and others</strong> about mental health conditions
              </span>
            </li>
            <li className="flex items-start p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300">
              <span className="mr-3 text-green-600 dark:text-green-400 text-lg font-bold">•</span>
              <span className="leading-relaxed text-base break-words">
                <strong>Use respectful language</strong> that doesn't define people by their condition
              </span>
            </li>
            <li className="flex items-start p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300">
              <span className="mr-3 text-green-600 dark:text-green-400 text-lg font-bold">•</span>
              <span className="leading-relaxed text-base break-words">
                <strong>Share your experiences</strong> if you're comfortable doing so
              </span>
            </li>
            <li className="flex items-start p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-300">
              <span className="mr-3 text-green-600 dark:text-green-400 text-lg font-bold">•</span>
              <span className="leading-relaxed text-base break-words">
                <strong>Show compassion</strong> for those with mental health conditions
              </span>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="card p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700">
          <div className="flex items-center mb-6">
            <FiBriefcase className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
            <h2 className="text-2xl font-semibold text-purple-800 dark:text-purple-200">Helpful Resources</h2>
          </div>
          <div className="space-y-6">
            {resources.map(resource => (
              <div key={resource.id} className="flex items-start gap-4 p-6 bg-gradient-to-br from-white to-purple-50 dark:from-purple-800/50 dark:to-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 mt-1 flex-shrink-0 border border-purple-200 dark:border-purple-700">
                  {resource.category === 'organization' && <FiUsers className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                  {resource.category === 'article' && <FiBookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                  {resource.category === 'video' && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-purple-600 dark:text-purple-400"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {resource.category === 'app' && <FiHeart className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center text-lg mb-2 break-words">
                    {resource.title}
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 text-base mt-2 leading-relaxed break-words mb-3">
                    {resource.description}
                  </p>
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-medium bg-purple-100 dark:bg-purple-900/30 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all duration-300"
                  >
                    Visit resource
                    <FiExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Information */}
        <div className="card bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 p-6 shadow-lg">
          <div className="flex items-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600 dark:text-red-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-semibold text-red-800 dark:text-red-200">If You're in Crisis</h2>
          </div>
          <p className="text-red-700 dark:text-red-300 mb-6 text-lg leading-relaxed">
            If you or someone you know is in immediate danger or having thoughts of suicide, please reach out for help immediately:
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300">
              <div className="font-semibold text-red-800 dark:text-red-200 text-lg mb-2">National Suicide Prevention Lifeline:</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">988 or 1-800-273-8255</div>
              <div className="text-red-600 dark:text-red-400 text-base">Available 24 hours, 7 days a week</div>
            </div>
            
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-300">
              <div className="font-semibold text-red-800 dark:text-red-200 text-lg mb-2">Crisis Text Line:</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Text HOME to 741741</div>
              <div className="text-red-600 dark:text-red-400 text-base">Available 24/7 for crisis support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness; 