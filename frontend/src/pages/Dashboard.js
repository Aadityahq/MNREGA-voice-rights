import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDistrictById } from '../api/districtApi';
import { saveToCache, getFromCache } from '../utils/offlineCache';
import DashboardCard from '../components/DashboardCard';
import TrendChart from '../components/TrendChart';
import AudioSummary from '../components/AudioSummary';
import LastUpdatedBadge from '../components/LastUpdatedBadge';

const Dashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [districtData, setDistrictData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDistrictData();
  }, [districtId]);

  const fetchDistrictData = async () => {
    setLoading(true);
    setError(null);

    const cached = getFromCache(`district_${districtId}`);
    if (cached) {
      setDistrictData(cached);
      setLoading(false);
    }

    try {
      const response = await getDistrictById(districtId);
      if (response.success && response.data) {
        setDistrictData(response.data);
        saveToCache(`district_${districtId}`, response.data);
      }
    } catch (err) {
      console.error('Error fetching district data:', err);
      if (!cached) {
        setError('Could not load data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !districtData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-xl text-gray-600">Loading district data...</p>
      </div>
    );
  }

  if (error && !districtData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="text-8xl mb-4">❌</span>
        <p className="text-2xl text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          <span>🏠</span>
          <span>Go Back Home</span>
        </button>
      </div>
    );
  }

  if (!districtData) {
    return null;
  }

  const latestMetrics = districtData.monthlyMetrics[districtData.monthlyMetrics.length - 1] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="mb-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-lg">
          <span>←</span>
          <span>Back to Selection</span>
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-5xl">📍</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {districtData.name}
              </h1>
            </div>
            <p className="text-2xl text-gray-600 ml-16">{districtData.state}</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <LastUpdatedBadge timestamp={districtData.lastUpdated} />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <AudioSummary districtId={districtId} />
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
          <span className="text-4xl">📊</span>
          <span>Current Month Statistics</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon="💼"
            value={latestMetrics.jobsGenerated?.toLocaleString() || '0'}
            label="Jobs Generated"
            subtitle="नौकरियां उत्पन्न"
            color="green"
          />
          
          <DashboardCard
            icon="💰"
            value={`₹${(latestMetrics.wagesPaid / 10000000).toFixed(2)}Cr`}
            label="Wages Paid"
            subtitle="मजदूरी भुगतान"
            color="yellow"
          />
          
          <DashboardCard
            icon="📅"
            value={latestMetrics.workdays?.toLocaleString() || '0'}
            label="Total Workdays"
            subtitle="कुल कार्यदिवस"
            color="blue"
          />
          
          <DashboardCard
            icon="👥"
            value={latestMetrics.employmentProvided?.toLocaleString() || '0'}
            label="Employment Provided"
            subtitle="रोजगार प्रदान किया"
            color="purple"
          />
        </div>
      </div>

      {districtData.monthlyMetrics && districtData.monthlyMetrics.length > 0 && (
        <div className="mb-12">
          <TrendChart 
            data={districtData.monthlyMetrics} 
            title="6-Month Trend / 6 महीने का रुझान"
          />
        </div>
      )}

      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-5xl">🎯</span>
          <h3 className="text-2xl font-bold text-gray-800">Performance Summary</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-2">📈</div>
            <p className="text-3xl font-bold text-green-600">
              {districtData.monthlyMetrics.length}
            </p>
            <p className="text-gray-600 font-semibold">Months of Data</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-2">💪</div>
            <p className="text-3xl font-bold text-blue-600">
              {latestMetrics.jobsGenerated > 15000 ? 'Excellent' : 'Good'}
            </p>
            <p className="text-gray-600 font-semibold">Job Generation</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-3xl font-bold text-purple-600">Active</p>
            <p className="text-gray-600 font-semibold">Program Status</p>
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50 p-8 rounded-2xl border-4 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-4xl">ℹ️</span>
          <h3 className="text-2xl font-bold text-blue-900">Need Help?</h3>
        </div>
        <p className="text-lg text-gray-700 mb-4">
          Click the audio button above to hear a summary of this data in simple language.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2 text-green-700">
            <span className="text-2xl">🟢</span>
            <span>Green = Good Performance</span>
          </div>
          <div className="flex items-center space-x-2 text-yellow-700">
            <span className="text-2xl">🟡</span>
            <span>Yellow = Moderate Performance</span>
          </div>
          <div className="flex items-center space-x-2 text-red-700">
            <span className="text-2xl">🔴</span>
            <span>Red = Needs Improvement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;