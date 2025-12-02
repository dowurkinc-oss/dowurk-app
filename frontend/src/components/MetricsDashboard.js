import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [valuation, setValuation] = useState(null);
  const [goals, setGoals] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [metricsRes, valuationRes, goalsRes, healthRes] = await Promise.all([
        axios.get(`${API}/metrics/summary`),
        axios.get(`${API}/metrics/valuation`),
        axios.get(`${API}/metrics/goals`),
        axios.get(`${API}/metrics/health`)
      ]);

      setMetrics(metricsRes.data);
      setValuation(valuationRes.data);
      setGoals(goalsRes.data);
      setHealth(healthRes.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics || !valuation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No metrics data available</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DowUrk AI Metrics Dashboard</h1>
          <p className="mt-2 text-gray-600">Track progress toward $1 billion valuation</p>
        </div>

        {/* Valuation Progress */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🎯 Path to $1 Billion</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Current Valuation</p>
              <p className="text-3xl font-bold">{formatCurrency(valuation.current_valuation)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Progress to $1B</p>
              <div className="flex items-center">
                <div className="flex-1 bg-white bg-opacity-20 rounded-full h-4 mr-3">
                  <div 
                    className="bg-white h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(valuation.progress_percentage, 100)}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold">{formatPercentage(valuation.progress_percentage)}</span>
              </div>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Months to $1B</p>
              <p className="text-3xl font-bold">{valuation.months_at_current_growth} mo</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <p className="text-sm text-blue-100">Current ARR: <span className="font-semibold text-white">{formatCurrency(valuation.current_arr)}</span></p>
            <p className="text-sm text-blue-100 mt-1">ARR needed for $1B: <span className="font-semibold text-white">{formatCurrency(valuation.arr_needed_for_billion)}</span></p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="ARR"
            value={formatCurrency(metrics.current.arr)}
            change={metrics.current.yoy_growth_rate}
            trend={metrics.mrr_trend}
            icon="💰"
          />
          <MetricCard
            title="MRR"
            value={formatCurrency(metrics.current.mrr)}
            change={metrics.current.mom_growth_rate}
            trend={metrics.mrr_trend}
            icon="📈"
          />
          <MetricCard
            title="Customers"
            value={metrics.current.total_customers.toLocaleString()}
            subtitle={`${metrics.current.active_customers} active`}
            trend={metrics.customer_trend}
            icon="👥"
          />
          <MetricCard
            title="ARPU"
            value={formatCurrency(metrics.current.arpu)}
            subtitle="per month"
            icon="💵"
          />
        </div>

        {/* Unit Economics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Unit Economics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">CAC (Customer Acquisition Cost)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.current.cac)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">LTV (Lifetime Value)</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.current.ltv)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">LTV/CAC Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.current.ltv_cac_ratio?.toFixed(1)}x
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Target: 3.0x (Excellent: 5.0x+)
              </p>
            </div>
          </div>
        </div>

        {/* Customer Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Customer Breakdown by Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <TierCard
              tier="Free"
              count={metrics.current.free_tier}
              color="bg-gray-100 text-gray-800"
            />
            <TierCard
              tier="Professional"
              count={metrics.current.professional_tier}
              color="bg-blue-100 text-blue-800"
            />
            <TierCard
              tier="Business"
              count={metrics.current.business_tier}
              color="bg-purple-100 text-purple-800"
            />
            <TierCard
              tier="Enterprise"
              count={metrics.current.enterprise_tier}
              color="bg-green-100 text-green-800"
            />
          </div>
        </div>

        {/* SaaS Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 Key SaaS Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gross Margin</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(metrics.current.gross_margin * 100)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Target: 70%+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Dollar Retention</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(metrics.current.net_dollar_retention || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Target: 110%+</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Rule of 40</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.current.rule_of_40?.toFixed(0) || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Target: 40+</p>
            </div>
          </div>
        </div>

        {/* Health Check */}
        {health && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏥 Metrics Health Check</h2>
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-lg font-semibold mr-2">Overall Health:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  health.overall_health === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {health.overall_health === 'healthy' ? '✅ Healthy' : '⚠️ Needs Attention'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {Object.entries(health.checks).map(([key, check]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      check.status === 'healthy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {check.status === 'healthy' ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span>Current: <strong>{check.value.toFixed(1)}</strong></span>
                    <span>Target: <strong>{check.target}</strong></span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Recommendations:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {health.recommendations.map((rec, idx) => (
                  <li key={idx}>• {rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Goals Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 5-Year Goals to $1B</h2>
          <div className="space-y-4">
            {goals.map((goal, idx) => (
              <div key={goal.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Year {goal.year}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Target ARR: <strong>{formatCurrency(goal.target_arr)}</strong> | 
                      Customers: <strong>{goal.target_customers.toLocaleString()}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Valuation</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(goal.target_arr * 10)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, trend, icon, subtitle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      {change !== undefined && change !== null && (
        <p className={`text-sm mt-2 ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {trend === 'up' && '↑'} {trend === 'down' && '↓'} {change > 0 ? '+' : ''}{change.toFixed(1)}%
        </p>
      )}
    </div>
  );
};

const TierCard = ({ tier, count, color }) => {
  return (
    <div className={`${color} rounded-lg p-4`}>
      <p className="text-sm font-medium mb-1">{tier}</p>
      <p className="text-2xl font-bold">{count.toLocaleString()}</p>
    </div>
  );
};

export default MetricsDashboard;
