import { useState } from 'react';

const SURVEY_SECTIONS = [
  {
    id: 'demographics',
    title: 'Demographics & Background',
    icon: '👤',
    description: 'Help us understand who you are and where you are on your entrepreneurial journey.',
    questions: [
      { id: 'q1', type: 'select', label: 'What is your age range?', options: ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'] },
      { id: 'q2', type: 'select', label: 'Which parish do you live in?', options: ['Tangipahoa', 'St. Tammany', 'Livingston', 'Washington', 'St. Helena', 'East Baton Rouge', 'Orleans', 'Jefferson', 'Lafayette', 'Caddo', 'Ouachita', 'Calcasieu', 'Rapides', 'Bossier', 'Other Louisiana Parish', 'Outside Louisiana'] },
      { id: 'q3', type: 'select', label: 'What is your current business stage?', options: ['Idea stage — I have a concept but have not started', 'Startup — Less than 1 year in operation', 'Early growth — 1 to 3 years in operation', 'Established — 3 to 5 years in operation', 'Mature — 5+ years in operation', 'Pivoting or restarting', 'I do not have a business yet'] },
      { id: 'q4', type: 'select', label: 'What is your highest level of education?', options: ['Some high school', 'High school diploma or GED', 'Some college', 'Associate degree', 'Bachelor\'s degree', 'Master\'s degree or higher', 'Trade or vocational certification'] },
      { id: 'q5', type: 'multiselect', label: 'Which of the following best describes you? (Select all that apply)', options: ['Black or African American', 'Hispanic or Latino', 'Native American or Alaska Native', 'Asian', 'Native Hawaiian or Pacific Islander', 'White', 'Two or more races', 'Prefer not to say'] },
    ]
  },
  {
    id: 'business_needs',
    title: 'Business Needs & Challenges',
    icon: '🏢',
    description: 'Tell us about the biggest challenges you face in starting or growing your business.',
    questions: [
      { id: 'q6', type: 'ranking', label: 'Rank your top 3 business challenges (1 = most critical):', options: ['Access to funding or capital', 'Business plan development', 'Marketing and customer acquisition', 'Financial management and bookkeeping', 'Legal compliance and registration', 'Finding mentors or advisors', 'Technology and digital tools', 'Work-life balance and mental health', 'Supply chain and operations', 'Hiring and managing employees'] },
      { id: 'q7', type: 'multiselect', label: 'What types of support would be most valuable to you? (Select all that apply)', options: ['One-on-one mentorship', 'Group workshops and training', 'Online courses (self-paced)', 'Grant writing assistance', 'Business plan review', 'Legal consultation', 'Accounting and tax help', 'Marketing and branding support', 'Technology training', 'Networking events', 'Mental health and wellness resources', 'Childcare during events'] },
      { id: 'q8', type: 'select', label: 'How much funding do you need to start or grow your business?', options: ['Less than $5,000', '$5,000 - $10,000', '$10,000 - $25,000', '$25,000 - $50,000', '$50,000 - $100,000', '$100,000 - $250,000', 'More than $250,000', 'I am not sure'] },
      { id: 'q9', type: 'multiselect', label: 'What funding sources have you explored? (Select all that apply)', options: ['Personal savings', 'Friends and family', 'Bank loans', 'SBA loans', 'Grants', 'Angel investors', 'Venture capital', 'Crowdfunding', 'None yet'] },
    ]
  },
  {
    id: 'community',
    title: 'Community & Resources',
    icon: '🤝',
    description: 'Help us understand what resources exist in your community and what gaps need to be filled.',
    questions: [
      { id: 'q10', type: 'scale', label: 'How would you rate access to entrepreneurial resources in your community?', min: 1, max: 10, minLabel: 'Very Poor', maxLabel: 'Excellent' },
      { id: 'q11', type: 'multiselect', label: 'What resources are currently available in your area? (Select all that apply)', options: ['Small Business Development Center (SBDC)', 'Chamber of Commerce', 'SCORE mentoring', 'Community college business programs', 'Incubators or accelerators', 'Co-working spaces', 'Networking groups', 'Local government business support', 'None that I know of'] },
      { id: 'q12', type: 'multiselect', label: 'What is missing in your community? (Select all that apply)', options: ['Affordable office or retail space', 'High-speed internet access', 'Business training programs', 'Mentorship opportunities', 'Networking events', 'Access to investors', 'Youth entrepreneurship programs', 'Cultural and heritage programming', 'Mental health services', 'Childcare services', 'Transportation'] },
      { id: 'q13', type: 'select', label: 'How do you prefer to access resources and training?', options: ['In-person at a local center', 'Online (live virtual sessions)', 'Online (self-paced courses)', 'Mobile app', 'A mix of in-person and online', 'No preference'] },
    ]
  },
  {
    id: 'seven_fs',
    title: 'The 7Fs Assessment',
    icon: '⭐',
    description: 'Rate your current confidence level in each of the 7Fs areas.',
    questions: [
      { id: 'q14', type: 'scale', label: 'Faith — Spiritual and personal grounding', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q15', type: 'scale', label: 'Fitness — Physical and mental wellness', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q16', type: 'scale', label: 'Foundation — Business structure and planning', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q17', type: 'scale', label: 'Fashion — Branding and personal presentation', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q18', type: 'scale', label: 'Film — Digital media and content creation', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q19', type: 'scale', label: 'Food — Nutrition, culinary, and agriculture', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
      { id: 'q20', type: 'scale', label: 'Finance — Financial literacy and capital management', min: 1, max: 10, minLabel: 'Need Support', maxLabel: 'Very Strong' },
    ]
  },
  {
    id: 'dowurk_feedback',
    title: 'DowUrk Platform Feedback',
    icon: '💬',
    description: 'Help us improve the DowUrk FramewUrk platform and services.',
    questions: [
      { id: 'q21', type: 'scale', label: 'How likely are you to recommend DowUrk to another entrepreneur?', min: 0, max: 10, minLabel: 'Not Likely', maxLabel: 'Extremely Likely' },
      { id: 'q22', type: 'multiselect', label: 'Which DowUrk features are most important to you? (Select all that apply)', options: ['AI Business Assistant', 'Business Directory', 'Grant Matching', 'PROOF Badge System', 'Learning Library', 'Community Feed', 'Events & Training', 'Mental Health Resources', 'The 7Fs Framework', 'Business Verification (LA SOS)'] },
      { id: 'q23', type: 'textarea', label: 'What is the single most important thing DowUrk could do to help you succeed?' },
      { id: 'q24', type: 'textarea', label: 'Is there anything else you would like us to know about your community\'s needs?' },
    ]
  }
];

function ScaleInput({ question, value, onChange }) {
  const range = [];
  for (let i = question.min; i <= question.max; i++) {
    range.push(i);
  }
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{question.minLabel}</span>
        <span>{question.maxLabel}</span>
      </div>
      <div className="flex gap-1">
        {range.map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              value === n
                ? 'bg-green-600 text-white scale-110'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function RankingInput({ question, value = [], onChange }) {
  const [selected, setSelected] = useState(value || []);

  const handleToggle = (option) => {
    let updated;
    if (selected.includes(option)) {
      updated = selected.filter(s => s !== option);
    } else if (selected.length < 3) {
      updated = [...selected, option];
    } else {
      return;
    }
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-2">Select up to 3 items. Order of selection determines rank.</p>
      {question.options.map((option) => {
        const rank = selected.indexOf(option);
        return (
          <button
            key={option}
            onClick={() => handleToggle(option)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center gap-3 ${
              rank >= 0
                ? 'bg-green-900/30 border-green-600 text-green-300'
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
            }`}
          >
            {rank >= 0 ? (
              <span className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                {rank + 1}
              </span>
            ) : (
              <span className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-gray-500 text-sm shrink-0">
                ○
              </span>
            )}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function NeedsAssessment() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const section = SURVEY_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / SURVEY_SECTIONS.length) * 100;

  const updateAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const toggleMultiSelect = (questionId, option) => {
    const current = answers[questionId] || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    updateAnswer(questionId, updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setShowResults(true);
  };

  const getSevenFsScores = () => {
    const labels = ['Faith', 'Fitness', 'Foundation', 'Fashion', 'Film', 'Food', 'Finance'];
    const ids = ['q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20'];
    return labels.map((label, i) => ({
      label,
      score: answers[ids[i]] || 0,
    }));
  };

  if (showResults) {
    const scores = getSevenFsScores();
    const npsScore = answers['q21'] || 0;
    const topChallenges = answers['q6'] || [];

    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Completing the Assessment</h1>
            <p className="text-green-200 text-lg">Your responses will help DowUrk better serve your community. Here is a summary of your results.</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* 7Fs Radar Summary */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-xl font-bold mb-6">Your 7Fs Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {scores.map((item) => (
                <div key={item.label} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={item.score >= 7 ? '#22c55e' : item.score >= 4 ? '#eab308' : '#ef4444'}
                        strokeWidth="3"
                        strokeDasharray={`${(item.score / 10) * 100} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {item.score}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4 justify-center text-xs text-gray-500">
              <span><span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span> Strong (7-10)</span>
              <span><span className="inline-block w-3 h-3 bg-yellow-500 rounded-full mr-1"></span> Developing (4-6)</span>
              <span><span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span> Needs Support (1-3)</span>
            </div>
          </div>

          {/* Top Challenges */}
          {topChallenges.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Your Top Challenges</h2>
              <div className="space-y-3">
                {topChallenges.map((challenge, i) => (
                  <div key={challenge} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4">
                    <span className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Resources */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Recommended DowUrk Resources</h2>
            <p className="text-gray-400 mb-6">Based on your responses, we recommend the following resources from the DowUrk Learning Library and AI Hub.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scores.filter(s => s.score < 7).map((item) => (
                <div key={item.label} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400">📚</span>
                    <span className="font-medium">Strengthen: {item.label}</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {item.label === 'Finance' && 'Start with the Financial Literacy for Founders guide in the Learning Library.'}
                    {item.label === 'Foundation' && 'Use the Business Plan Template and AI Coach for structured guidance.'}
                    {item.label === 'Faith' && 'Explore the 7Fs Faith module for personal grounding exercises.'}
                    {item.label === 'Fitness' && 'Check out the Mental Wellness for Entrepreneurs guide.'}
                    {item.label === 'Fashion' && 'Use the Marketing on a Shoestring guide for branding help.'}
                    {item.label === 'Film' && 'Explore the AI Workflows for content creation pipelines.'}
                    {item.label === 'Food' && 'Connect with culinary programs through the DowUrk Community.'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* NPS */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
            <h2 className="text-xl font-bold mb-2">Your Recommendation Score</h2>
            <div className={`text-5xl font-bold mb-2 ${npsScore >= 9 ? 'text-green-400' : npsScore >= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
              {npsScore}/10
            </div>
            <p className="text-gray-400 text-sm">
              {npsScore >= 9 ? 'You are a DowUrk Promoter! Thank you for your support.' :
               npsScore >= 7 ? 'Thank you! We are working to earn your full endorsement.' :
               'We hear you. Your feedback will help us improve.'}
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => { setShowResults(false); setSubmitted(false); setCurrentSection(0); setAnswers({}); }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Take Assessment Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-700/50 px-4 py-2 rounded-full text-green-200 text-sm mb-4">
            <span>📊</span> Community Needs Assessment
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Help Us Serve You Better</h1>
          <p className="text-green-200 max-w-2xl mx-auto">
            This assessment helps DowUrk understand your needs, challenges, and goals so we can tailor
            our programs and resources to create the greatest impact in your community.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Section {currentSection + 1} of {SURVEY_SECTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {SURVEY_SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentSection(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                i === currentSection
                  ? 'bg-green-600 text-white'
                  : i < currentSection
                  ? 'bg-gray-800 text-green-400'
                  : 'bg-gray-800/50 text-gray-500'
              }`}
            >
              <span>{s.icon}</span>
              <span className="hidden md:inline">{s.title}</span>
              {i < currentSection && <span>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Current Section */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{section.icon}</span>
            <h2 className="text-2xl font-bold">{section.title}</h2>
          </div>
          <p className="text-gray-400 mb-8">{section.description}</p>

          <div className="space-y-8">
            {section.questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <label className="block font-medium text-gray-200">{question.label}</label>

                {question.type === 'select' && (
                  <select
                    value={answers[question.id] || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none"
                  >
                    <option value="">Select an option...</option>
                    {question.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {question.type === 'multiselect' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {question.options.map((opt) => {
                      const selected = (answers[question.id] || []).includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleMultiSelect(question.id, opt)}
                          className={`text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                            selected
                              ? 'bg-green-900/30 border-green-600 text-green-300'
                              : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-600'
                          }`}
                        >
                          <span className="mr-2">{selected ? '✓' : '○'}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {question.type === 'scale' && (
                  <ScaleInput
                    question={question}
                    value={answers[question.id]}
                    onChange={(val) => updateAnswer(question.id, val)}
                  />
                )}

                {question.type === 'ranking' && (
                  <RankingInput
                    question={question}
                    value={answers[question.id]}
                    onChange={(val) => updateAnswer(question.id, val)}
                  />
                )}

                {question.type === 'textarea' && (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => updateAnswer(question.id, e.target.value)}
                    placeholder="Type your response here..."
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none resize-none"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-800">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                currentSection === 0
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              ← Previous
            </button>

            {currentSection < SURVEY_SECTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Next Section →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all"
              >
                Submit Assessment ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
