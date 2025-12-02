import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const [packages, setPackages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPackage, setProcessingPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/packages`
      );
      const data = await response.json();
      setPackages(data.packages);
    } catch (err) {
      console.error('Error fetching packages:', err);
      setError('Failed to load pricing packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId) => {
    if (packageId === 'free') {
      // Free tier - just navigate to registration
      navigate('/register');
      return;
    }

    setProcessingPackage(packageId);
    setError('');

    try {
      // Get user email if logged in
      const userData = localStorage.getItem('user');
      let userEmail = null;
      if (userData) {
        try {
          userEmail = JSON.parse(userData).email;
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      // Create checkout session
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            package_id: packageId,
            origin_url: window.location.origin,
            user_email: userEmail
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
      setError(err.message || 'Failed to start checkout process');
    } finally {
      setProcessingPackage(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const packageOrder = ['free', 'professional', 'business', 'enterprise'];
  const orderedPackages = packageOrder.map(id => ({ id, ...packages[id] }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">Start free, upgrade as you grow</p>
        </div>

        {error && (
          <div className="mb-6 max-w-2xl mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderedPackages.map((pkg) => {
            const isPopular = pkg.id === 'professional';
            const isFree = pkg.id === 'free';
            
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl shadow-lg p-8 relative ${
                  isPopular ? 'ring-2 ring-purple-600 transform scale-105' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 rounded-bl-lg rounded-tr-2xl text-sm font-semibold">
                    POPULAR
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                    {!isFree && <span className="text-gray-600">/month</span>}
                  </div>

                  <button
                    onClick={() => handleSubscribe(pkg.id)}
                    disabled={processingPackage === pkg.id}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isPopular
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processingPackage === pkg.id
                      ? 'Processing...'
                      : isFree
                      ? 'Get Started'
                      : 'Subscribe'}
                  </button>
                </div>

                <ul className="mt-8 space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;