import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setError('No session ID found');
      return;
    }

    pollPaymentStatus();
  }, [sessionId]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    if (attempts >= maxAttempts) {
      setStatus('timeout');
      setError('Payment verification timed out. Please check your email for confirmation.');
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/payments/checkout/status/${sessionId}`
      );

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      setPaymentDetails(data);

      if (data.payment_status === 'paid') {
        setStatus('success');
        // Update user data in localStorage if exists
        const userData = localStorage.getItem('user');
        if (userData && data.metadata?.package_id) {
          try {
            const user = JSON.parse(userData);
            user.role = data.metadata.package_id;
            localStorage.setItem('user', JSON.stringify(user));
          } catch (e) {
            console.error('Error updating user data:', e);
          }
        }
        return;
      } else if (data.status === 'expired') {
        setStatus('expired');
        setError('Payment session expired. Please try again.');
        return;
      }

      // If payment is still pending, continue polling
      setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
    } catch (err) {
      console.error('Error checking payment status:', err);
      setStatus('error');
      setError('Error verifying payment. Please contact support.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {status === 'checking' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Thank you for subscribing to DowUrk AI.</p>
            
            {paymentDetails?.metadata?.package_name && (
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Subscription Plan</p>
                <p className="text-lg font-semibold text-purple-600">
                  {paymentDetails.metadata.package_name}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {(status === 'error' || status === 'expired' || status === 'timeout') && (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <button
              onClick={() => navigate('/pricing')}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;