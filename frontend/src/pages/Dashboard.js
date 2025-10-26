import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import GovtHeader from '../components/GovtHeader';
import GovtFooter from '../components/GovtFooter';
import Loading from '../components/Loading';

const Dashboard = () => {
  const { districtId } = useParams();
  const navigate = useNavigate();
  const [district, setDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchDistrictData();
  }, [districtId]);

  const fetchDistrictData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.getDistrictById(districtId);
      if (response.success) {
        setDistrict(response.data);
      } else {
        setError('District not found');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load district data. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const speakSummary = async () => {
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }

    try {
      const response = await api.getAudioSummary(districtId);
      if (response.success && response.summary) {
        const utterance = new SpeechSynthesisUtterance(response.summary);
        utterance.lang = 'en-IN';
        utterance.rate = 0.9;

        utterance.onstart = () => setPlaying(true);
        utterance.onend = () => setPlaying(false);
        utterance.onerror = () => {
          setPlaying(false);
          alert('Error playing audio');
        };

        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Could not load audio summary');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GovtHeader />
        <main className="flex-grow flex items-center justify-center">
          <Loading message="Loading district data..." />
        </main>
        <GovtFooter />
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GovtHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <span className="text-8xl">❌</span>
            <p className="text-2xl text-red-600 mt-4">{error}</p>
            <button onClick={() => navigate('/')} className="btn-govt-primary mt-6 mx-auto">
              <span>🏠</span>
              <span>Go Back Home</span>
            </button>
          </div>
        </main>
        <GovtFooter />
      </div>
    );
  }

  const latest = district.monthlyMetrics[district.monthlyMetrics.length - 1] || {};

  const chartData = district.monthlyMetrics.map(item => ({
    month: `${item.month} ${item.year}`,
    'Jobs': item.jobsGenerated,
    'Wages (₹L)': Math.round(item.wagesPaid / 100000),
    'Workdays': item.workdays
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GovtHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate('/')} className="mb-6 text-ashoka-blue hover:text-india-saffron font-semibold text-lg">
            ← Back to Home
          </button>

          <div className="govt-card mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
                  <span className="text-5xl">📍</span>
                  <span>{district.name}</span>
                </h1>
                <p className="text-2xl text-gray-600 mt-2">{district.state}</p>
              </div>
              <div className="govt-badge govt-badge-blue">
                <span className="text-xl">🕐</span>
                <span className="ml-2">Updated: {new Date(district.lastUpdated).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <button onClick={speakSummary} className="btn-govt-primary mx-auto">
                <span className="text-3xl">{playing ? '⏸️' : '🔊'}</span>
                <span>{playing ? 'Stop Audio' : 'Listen to Summary'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="metric-card metric-card-green">
              <div className="text-6xl mb-2">💼</div>
              <div className="text-4xl font-bold">{latest.jobsGenerated?.toLocaleString() || '0'}</div>
              <div className="text-sm opacity-90">Jobs Generated</div>
              <div className="text-xs opacity-75 mt-1">नौकरियां उत्पन्न</div>
            </div>

            <div className="metric-card metric-card-gold">
              <div className="text-6xl mb-2">💰</div>
              <div className="text-4xl font-bold">₹{(latest.wagesPaid / 10000000).toFixed(2)}Cr</div>
              <div className="text-sm opacity-90">Wages Paid</div>
              <div className="text-xs opacity-75 mt-1">मजदूरी भुगतान</div>
            </div>

            <div className="metric-card metric-card-blue">
              <div className="text-6xl mb-2">��</div>
              <div className="text-4xl font-bold">{latest.workdays?.toLocaleString() || '0'}</div>
              <div className="text-sm opacity-90">Workdays</div>
              <div className="text-xs opacity-75 mt-1">कार्यदिवस</div>
            </div>

            <div className="metric-card metric-card-saffron">
              <div className="text-6xl mb-2">👥</div>
              <div className="text-4xl font-bold">{latest.employmentProvided?.toLocaleString() || '0'}</div>
              <div className="text-sm opacity-90">Employment</div>
              <div className="text-xs opacity-75 mt-1">रोजगार</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="govt-card mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <span className="text-4xl">📈</span>
                <span>Monthly Trends / मासिक रुझान</span>
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Jobs" stroke="#138808" strokeWidth={3} />
                  <Line type="monotone" dataKey="Wages (₹L)" stroke="#FFD700" strokeWidth={3} />
                  <Line type="monotone" dataKey="Workdays" stroke="#000080" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="govt-card-green">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
              <span className="text-4xl">🎯</span>
              <span>Performance Summary</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-india-saffron">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-3xl font-bold text-india-saffron">{district.monthlyMetrics.length}</p>
                <p className="text-gray-600 font-semibold">Months of Data</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-india-green">
                <div className="text-5xl mb-3">💪</div>
                <p className="text-3xl font-bold text-india-green">
                  {latest.jobsGenerated > 20000 ? 'Excellent' : latest.jobsGenerated > 10000 ? 'Good' : 'Fair'}
                </p>
                <p className="text-gray-600 font-semibold">Performance</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center border-2 border-ashoka-blue">
                <div className="text-5xl mb-3">✅</div>
                <p className="text-3xl font-bold text-ashoka-blue">Active</p>
                <p className="text-gray-600 font-semibold">Status</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <GovtFooter />
    </div>
  );
};

export default Dashboard;
