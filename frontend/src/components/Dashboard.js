import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Redirect to home
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">DowUrk AI</h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.full_name}! 👋</h2>
          <p className="text-purple-100">Ready to grow your business with AI?</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Organization Type</p>
              <p className="font-medium text-gray-900 capitalize">{user.organization_type}</p>
            </div>
            {user.company_name && (
              <div>
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-medium text-gray-900">{user.company_name}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="font-medium text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/ai-assistant"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
              AI Business Assistant
            </h3>
            <p className="text-gray-600 text-sm">
              Get expert guidance for your business planning
            </p>
          </Link>

          <Link
            to="/metrics"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
              Metrics Dashboard
            </h3>
            <p className="text-gray-600 text-sm">
              Track your business progress and goals
            </p>
          </Link>

          <Link
            to="/docs"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition">
              Strategic Resources
            </h3>
            <p className="text-gray-600 text-sm">
              Access fundraising and business strategies
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;