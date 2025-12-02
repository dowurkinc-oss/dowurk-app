import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const DocsViewer = () => {
  const { docId } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const docs = {
    'strategic-resources': {
      title: 'DowUrk Strategic Resources',
      file: 'DOWURK_STRATEGIC_RESOURCES.md',
      description: 'Master guide with all resources'
    },
    'fundraising': {
      title: 'Fundraising Strategy',
      file: 'FUNDRAISING_STRATEGY.md',
      description: 'Complete path to $1B valuation'
    },
    'security': {
      title: 'Security Implementation',
      file: 'SECURITY_IMPLEMENTATION_GUIDE.md',
      description: 'Enterprise-grade security guide'
    },
    'competitive': {
      title: 'Competitive Analysis',
      file: 'COMPETITIVE_ANALYSIS_FRAMEWORK.md',
      description: 'Market intelligence and positioning'
    },
    'metrics': {
      title: 'Metrics Dashboard Guide',
      file: 'METRICS_DASHBOARD_GUIDE.md',
      description: 'Track progress to unicorn status'
    },
    'mvp': {
      title: 'MVP Roadmap',
      file: 'MVP_ROADMAP.md',
      description: '8-week build plan'
    },
    'options': {
      title: 'Implementation Guide',
      file: 'OPTIONS_1234_IMPLEMENTATION.md',
      description: 'AI, Auth, Payments, Fundraising'
    },
    'implementation': {
      title: 'Implementation Complete',
      file: 'IMPLEMENTATION_COMPLETE.md',
      description: 'What has been delivered'
    }
  };

  const currentDoc = docs[docId] || docs['strategic-resources'];

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch from backend API
        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
        const response = await fetch(`${BACKEND_URL}/docs/${currentDoc.file}`);
        if (!response.ok) {
          throw new Error('Document not found');
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError('Unable to load document. The file may not be accessible via web server.');
        // Show instructions instead
        setContent(`# Document Not Available Via Web

This document is located at: \`/app/${currentDoc.file}\`

## How to Access:

**Option 1: View in Terminal**
\`\`\`bash
cat /app/${currentDoc.file}
less /app/${currentDoc.file}
\`\`\`

**Option 2: Download via API**
Ask the assistant to display the content of this file.

**Option 3: Access via File System**
The file is in your project at \`/app/${currentDoc.file}\`

## Quick Overview

${getDocumentSummary(docId)}
`);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [docId, currentDoc.file]);

  const getDocumentSummary = (id) => {
    const summaries = {
      'strategic-resources': `**Master Resource Guide**
- Complete package overview
- Quick start guide
- All documentation indexed
- Implementation priorities
- Success milestones`,
      'fundraising': `**Path to $1 Billion**
- 15-slide pitch deck framework
- 5-year financial projections
- Investor targeting strategy
- Funding rounds roadmap (Pre-seed → Series C)
- Required: $100M ARR for $1B valuation`,
      'security': `**Enterprise Security**
- Authentication & JWT implementation
- Rate limiting & audit logging
- Data encryption (PII protection)
- GDPR/CCPA/SOC 2 compliance
- Security checklist`,
      'competitive': `**Market Intelligence**
- Deep dives on 5 competitors
- Feature comparison matrix
- Pricing analysis
- Competitive advantages
- Strategic recommendations`,
      'metrics': `**Progress Tracking**
- Dashboard implementation
- Key SaaS metrics explained
- API endpoints documentation
- Integration guide`,
      'mvp': `**8-Week Build Plan**
- Week-by-week roadmap
- Feature priorities
- MVP success criteria
- Launch checklist`,
      'options': `**All 4 Options Delivered**
- AI Integration (OpenAI/Claude)
- User Authentication (JWT)
- Stripe Payments
- Fundraising Strategy`,
      'implementation': `**What's Been Built**
- Authentication system ✅
- Metrics dashboard ✅
- Security modules ✅
- Complete documentation ✅`
    };
    return summaries[id] || '';
  };

  const renderMarkdown = (text) => {
    // Simple markdown rendering (for basic display)
    return text
      .split('\n')
      .map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-gray-900">{line.slice(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold mt-6 mb-3 text-gray-900">{line.slice(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-gray-900">{line.slice(4)}</h3>;
        } else if (line.startsWith('```')) {
          return <div key={idx} className="bg-gray-800 text-green-400 p-4 rounded my-2 font-mono text-sm overflow-x-auto">{line}</div>;
        } else if (line.startsWith('- ')) {
          return <li key={idx} className="ml-4 text-gray-700">{line.slice(2)}</li>;
        } else if (line.trim() === '') {
          return <br key={idx} />;
        } else {
          return <p key={idx} className="text-gray-700 my-2">{line}</p>;
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">📚 DowUrk AI Documentation</h1>
            <Link to="/metrics" className="text-purple-600 hover:text-purple-800 font-semibold">
              View Metrics →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Documentation</h3>
              <nav className="space-y-2">
                {Object.entries(docs).map(([id, doc]) => (
                  <Link
                    key={id}
                    to={`/docs/${id}`}
                    className={`block px-3 py-2 rounded transition-colors ${
                      docId === id || (!docId && id === 'strategic-resources')
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-semibold text-sm">{doc.title}</div>
                    <div className={`text-xs mt-1 ${
                      docId === id || (!docId && id === 'strategic-resources')
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}>
                      {doc.description}
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading document...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentDoc.title}</h1>
                    <p className="text-gray-600">{currentDoc.description}</p>
                  </div>

                  {error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800 font-semibold mb-2">⚠️ Note:</p>
                      <p className="text-yellow-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="prose max-w-none">
                    {renderMarkdown(content)}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>File Location:</strong> <code className="bg-gray-100 px-2 py-1 rounded">/app/{currentDoc.file}</code>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsViewer;
