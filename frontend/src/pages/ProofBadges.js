import { useState } from 'react';

const BADGE_CATEGORIES = [
  {
    name: 'Business Foundations',
    icon: '🏗️',
    color: 'from-blue-500 to-blue-700',
    badges: [
      { id: 'bf-001', name: 'Business Plan Certified', description: 'Completed a comprehensive business plan', level: 'Gold', linkedInSkill: 'Business Planning', criteria: 'Submit and pass review of a complete business plan through the DowUrk platform.' },
      { id: 'bf-002', name: 'LLC Formation Complete', description: 'Successfully registered a business entity', level: 'Silver', linkedInSkill: 'Business Formation', criteria: 'Provide proof of business registration with the Louisiana Secretary of State.' },
      { id: 'bf-003', name: 'EIN Obtained', description: 'Secured an Employer Identification Number', level: 'Bronze', linkedInSkill: 'Tax Compliance', criteria: 'Upload your IRS EIN confirmation letter.' },
      { id: 'bf-004', name: 'Compliance Champion', description: 'Business in good standing with all state requirements', level: 'Gold', linkedInSkill: 'Regulatory Compliance', criteria: 'Pass a Louisiana SOS compliance verification check through the DowUrk platform.' },
    ]
  },
  {
    name: 'Financial Literacy',
    icon: '💰',
    color: 'from-green-500 to-green-700',
    badges: [
      { id: 'fl-001', name: 'Budget Builder', description: 'Created a 12-month operating budget', level: 'Silver', linkedInSkill: 'Financial Planning', criteria: 'Complete the Financial Literacy for Founders course and submit a 12-month budget.' },
      { id: 'fl-002', name: 'Capital Ready', description: 'Completed capital readiness assessment', level: 'Gold', linkedInSkill: 'Capital Markets', criteria: 'Score 80% or higher on the Capital Readiness Assessment.' },
      { id: 'fl-003', name: 'Grant Winner', description: 'Successfully secured grant funding', level: 'Platinum', linkedInSkill: 'Grant Writing', criteria: 'Provide documentation of a successfully awarded grant.' },
      { id: 'fl-004', name: 'Cash Flow Master', description: 'Maintained positive cash flow for 6 months', level: 'Gold', linkedInSkill: 'Cash Flow Management', criteria: 'Submit 6 months of financial statements showing positive cash flow.' },
    ]
  },
  {
    name: 'Leadership & Community',
    icon: '🤝',
    color: 'from-purple-500 to-purple-700',
    badges: [
      { id: 'lc-001', name: 'Mentor Match', description: 'Completed a mentorship program', level: 'Gold', linkedInSkill: 'Mentorship', criteria: 'Complete a full mentorship cycle (minimum 3 months) through the DowUrk platform.' },
      { id: 'lc-002', name: 'Community Leader', description: 'Led a community initiative or event', level: 'Silver', linkedInSkill: 'Community Leadership', criteria: 'Organize and lead a community event with at least 10 participants.' },
      { id: 'lc-003', name: 'Peer Coach', description: 'Mentored another entrepreneur', level: 'Gold', linkedInSkill: 'Coaching', criteria: 'Serve as a peer mentor for at least one entrepreneur for 3+ months.' },
      { id: 'lc-004', name: 'Accountability Partner', description: 'Maintained a 90-day accountability streak', level: 'Silver', linkedInSkill: 'Goal Setting', criteria: 'Complete 90 consecutive days of accountability check-ins.' },
    ]
  },
  {
    name: 'The 7Fs Mastery',
    icon: '⭐',
    color: 'from-amber-500 to-amber-700',
    badges: [
      { id: '7f-001', name: 'Faith Foundations', description: 'Completed the Faith module', level: 'Bronze', linkedInSkill: 'Personal Development', criteria: 'Complete all Faith module coursework and reflection exercises.' },
      { id: '7f-002', name: 'Fitness Forward', description: 'Completed the Fitness module', level: 'Bronze', linkedInSkill: 'Wellness', criteria: 'Complete the Fitness module and maintain a 30-day wellness streak.' },
      { id: '7f-003', name: 'Financial Fluency', description: 'Completed the Finance module', level: 'Silver', linkedInSkill: 'Financial Literacy', criteria: 'Complete all Finance module coursework and pass the assessment.' },
      { id: '7f-004', name: '7Fs Graduate', description: 'Completed all seven F modules', level: 'Platinum', linkedInSkill: 'Holistic Business Development', criteria: 'Complete all seven modules of the 7Fs Methodology.' },
    ]
  },
  {
    name: 'Digital & Marketing',
    icon: '📱',
    color: 'from-pink-500 to-pink-700',
    badges: [
      { id: 'dm-001', name: 'Social Media Strategist', description: 'Launched a social media marketing campaign', level: 'Silver', linkedInSkill: 'Social Media Marketing', criteria: 'Complete the Marketing on a Shoestring course and launch a documented campaign.' },
      { id: 'dm-002', name: 'Brand Builder', description: 'Developed a complete brand identity', level: 'Gold', linkedInSkill: 'Brand Development', criteria: 'Submit a complete brand kit including logo, colors, typography, and brand voice guide.' },
      { id: 'dm-003', name: 'AI Adopter', description: 'Completed AI business tools training', level: 'Silver', linkedInSkill: 'AI for Business', criteria: 'Complete the AI Hackbook training and demonstrate use of 3+ AI tools in your business.' },
      { id: 'dm-004', name: 'Digital Storefront', description: 'Launched an online presence', level: 'Bronze', linkedInSkill: 'E-Commerce', criteria: 'Launch a functional website or online store for your business.' },
    ]
  }
];

const LEVEL_COLORS = {
  Bronze: 'bg-amber-700 text-amber-100',
  Silver: 'bg-gray-400 text-gray-900',
  Gold: 'bg-yellow-500 text-yellow-900',
  Platinum: 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white',
};

const LEVEL_BORDERS = {
  Bronze: 'border-amber-700',
  Silver: 'border-gray-400',
  Gold: 'border-yellow-500',
  Platinum: 'border-purple-500',
};

export default function ProofBadges() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState(['bf-001', 'fl-001', 'lc-004', 'dm-004']);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [linkedInBadge, setLinkedInBadge] = useState(null);

  const totalBadges = BADGE_CATEGORIES.reduce((sum, cat) => sum + cat.badges.length, 0);
  const earnedCount = earnedBadges.length;

  const handleShareToLinkedIn = (badge) => {
    setLinkedInBadge(badge);
    setShowLinkedInModal(true);
  };

  const generateLinkedInUrl = (badge) => {
    const certName = encodeURIComponent(`DowUrk PROOF: ${badge.name}`);
    const orgName = encodeURIComponent('DowUrk Inc.');
    const orgId = '81355399';
    const issueDate = new Date();
    const issueMonth = issueDate.getMonth() + 1;
    const issueYear = issueDate.getFullYear();
    const certUrl = encodeURIComponent(`https://www.dowurktoday.org/proof/verify/${badge.id}`);

    return `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${certName}&organizationName=${orgName}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${certUrl}&certId=${badge.id}`;
  };

  const generateLinkedInPostUrl = (badge) => {
    const text = encodeURIComponent(
      `I just earned the "${badge.name}" PROOF badge from @DowUrk Inc.! 🎉\n\n${badge.description}\n\nThe PROOF Credential System is building a transcript for real life — verifying the skills, milestones, and commitments that matter in entrepreneurship.\n\nLearn more: https://www.dowurktoday.org/proof\n\n#DowUrk #PROOF #Entrepreneurship #${badge.linkedInSkill.replace(/\s/g, '')}`
    );
    return `https://www.linkedin.com/sharing/share-offsite/?url=https://www.dowurktoday.org/proof&text=${text}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-700/50 px-4 py-2 rounded-full text-green-200 text-sm mb-6">
            <span>🛡️</span> PROOF Credential System
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Record. Your Credentials. Your Future.
          </h1>
          <p className="text-green-200 text-lg max-w-3xl mx-auto mb-8">
            Earn verified badges that prove your entrepreneurial journey. Share them on LinkedIn
            to showcase your skills, milestones, and commitment to professional growth.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-green-700/30 rounded-xl p-4">
              <div className="text-3xl font-bold">{totalBadges}</div>
              <div className="text-green-300 text-sm">Badges Available</div>
            </div>
            <div className="bg-green-700/30 rounded-xl p-4">
              <div className="text-3xl font-bold">{BADGE_CATEGORIES.length}</div>
              <div className="text-green-300 text-sm">Categories</div>
            </div>
            <div className="bg-green-700/30 rounded-xl p-4">
              <div className="text-3xl font-bold">{earnedCount}</div>
              <div className="text-green-300 text-sm">Badges Earned</div>
            </div>
            <div className="bg-green-700/30 rounded-xl p-4">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-green-300 text-sm">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Integration Banner */}
      <div className="bg-blue-900/40 border-y border-blue-700/50 py-6 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
              in
            </div>
            <div>
              <h3 className="font-bold text-lg">LinkedIn Badge Integration</h3>
              <p className="text-blue-300 text-sm">Add your PROOF badges as certifications on your LinkedIn profile and share achievements with your network.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Connect LinkedIn
            </button>
            <button className="border border-blue-500 text-blue-300 hover:bg-blue-800/50 px-6 py-2 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Your PROOF Passport Progress</h3>
            <span className="text-green-400 font-bold">{earnedCount}/{totalBadges} Badges</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(earnedCount / totalBadges) * 100}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {Math.round((earnedCount / totalBadges) * 100)}% complete — Keep going! Earn more badges to strengthen your entrepreneurial transcript.
          </p>
        </div>
      </div>

      {/* Badge Categories */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold mb-6">Badge Categories</h2>

        <div className="space-y-6">
          {BADGE_CATEGORIES.map((category) => (
            <div key={category.name} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">{category.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {category.badges.filter(b => earnedBadges.includes(b.id)).length}/{category.badges.length} earned
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 text-2xl">
                  {selectedCategory === category.name ? '−' : '+'}
                </span>
              </button>

              {/* Badge Grid */}
              {selectedCategory === category.name && (
                <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.badges.map((badge) => {
                    const isEarned = earnedBadges.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-xl p-5 border-2 transition-all ${
                          isEarned
                            ? `bg-gray-800/80 ${LEVEL_BORDERS[badge.level]} shadow-lg`
                            : 'bg-gray-800/30 border-gray-700 opacity-75'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold">{badge.name}</h4>
                              {isEarned && <span className="text-green-400">✓</span>}
                            </div>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${LEVEL_COLORS[badge.level]}`}>
                              {badge.level}
                            </span>
                          </div>
                          {isEarned && (
                            <div className="text-3xl">🏅</div>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{badge.description}</p>

                        {/* Criteria */}
                        <button
                          onClick={() => setSelectedBadge(selectedBadge === badge.id ? null : badge.id)}
                          className="text-blue-400 text-sm hover:text-blue-300 mb-3"
                        >
                          {selectedBadge === badge.id ? 'Hide criteria ▲' : 'View criteria ▼'}
                        </button>
                        {selectedBadge === badge.id && (
                          <div className="bg-gray-900/50 rounded-lg p-3 mb-3 text-sm text-gray-300">
                            <strong>How to earn:</strong> {badge.criteria}
                          </div>
                        )}

                        {/* LinkedIn Skill Tag */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
                            LinkedIn Skill: {badge.linkedInSkill}
                          </span>
                        </div>

                        {/* Actions */}
                        {isEarned ? (
                          <div className="flex gap-2">
                            <a
                              href={generateLinkedInUrl(badge)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg text-center transition-colors"
                              onClick={(e) => { e.preventDefault(); handleShareToLinkedIn(badge); }}
                            >
                              Add to LinkedIn
                            </a>
                            <a
                              href={generateLinkedInPostUrl(badge)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 border border-blue-500 text-blue-300 hover:bg-blue-800/50 text-sm py-2 px-3 rounded-lg text-center transition-colors"
                            >
                              Share Achievement
                            </a>
                          </div>
                        ) : (
                          <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm py-2 px-3 rounded-lg transition-colors">
                            Start Earning This Badge
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How LinkedIn Integration Works */}
      <div className="bg-gray-900 border-t border-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2 text-center">How LinkedIn Badge Integration Works</h2>
          <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
            Your PROOF badges are verified credentials that translate directly to your professional profile.
            Here is how to showcase your entrepreneurial journey on LinkedIn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Earn a Badge', desc: 'Complete the requirements for any PROOF badge through the DowUrk platform.', icon: '🎯' },
              { step: '2', title: 'Verify Credential', desc: 'Your badge is verified by DowUrk and assigned a unique credential ID.', icon: '✅' },
              { step: '3', title: 'Add to LinkedIn', desc: 'Click "Add to LinkedIn" to add the badge as a certification on your profile.', icon: '🔗' },
              { step: '4', title: 'Share & Grow', desc: 'Share your achievement with your network and attract opportunities.', icon: '🚀' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-green-900/50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-green-400 font-bold text-sm mb-1">Step {item.step}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Badges Standard */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-green-800/50 rounded-2xl flex items-center justify-center text-4xl shrink-0">
              🛡️
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Built on the Open Badges Standard</h3>
              <p className="text-gray-400">
                DowUrk PROOF badges are built on the Open Badges 2.0 standard, ensuring they are portable,
                verifiable, and recognized across platforms. Each badge contains metadata about the issuer,
                the criteria for earning, and evidence of achievement. This means your credentials are not
                locked into a single platform — they travel with you throughout your professional career.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LinkedIn Modal */}
      {showLinkedInModal && linkedInBadge && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-lg w-full p-8 border border-gray-700">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🏅</div>
              <h3 className="text-xl font-bold mb-2">Add "{linkedInBadge.name}" to LinkedIn</h3>
              <p className="text-gray-400 text-sm">Choose how you would like to showcase this badge on LinkedIn.</p>
            </div>

            <div className="space-y-3 mb-6">
              <a
                href={generateLinkedInUrl(linkedInBadge)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-center font-medium transition-colors"
              >
                <span className="mr-2">📋</span> Add as LinkedIn Certification
              </a>
              <a
                href={generateLinkedInPostUrl(linkedInBadge)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full border border-blue-500 text-blue-300 hover:bg-blue-800/50 py-3 px-4 rounded-xl text-center font-medium transition-colors"
              >
                <span className="mr-2">📢</span> Share as LinkedIn Post
              </a>
              <div className="bg-gray-800 rounded-xl p-4 text-sm">
                <div className="font-medium mb-1">Badge Details</div>
                <div className="text-gray-400 space-y-1">
                  <div><strong>Credential ID:</strong> {linkedInBadge.id}</div>
                  <div><strong>Issuer:</strong> DowUrk Inc.</div>
                  <div><strong>LinkedIn Skill:</strong> {linkedInBadge.linkedInSkill}</div>
                  <div><strong>Level:</strong> {linkedInBadge.level}</div>
                  <div><strong>Verification URL:</strong> dowurktoday.org/proof/verify/{linkedInBadge.id}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setShowLinkedInModal(false); setLinkedInBadge(null); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 px-4 rounded-xl text-center font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
