import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GovtHeader from '../components/GovtHeader';
import GovtFooter from '../components/GovtFooter';
import Loading from '../components/Loading';

const Home = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStates();
    fetchStatistics();
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getStates();
      if (response.success) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load states. Please ensure backend is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStateChange = async (e) => {
    const stateName = e.target.value;
    setSelectedState(stateName);
    setSelectedDistrict('');
    setDistricts([]);

    if (!stateName) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.getDistrictsByState(stateName);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load districts');
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    if (districtId) {
      setSelectedDistrict(districtId);
      navigate(`/dashboard/${districtId}`);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        alert(`Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\n\nPlease select your state manually for now.`);
        setDetectingLocation(false);
      },
      (error) => {
        alert('Could not detect location. Please select manually.');
        setDetectingLocation(false);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GovtHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-india-saffron to-india-green rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-5xl">🏛️</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-india-saffron">MGNREGA</span>
              <span className="text-gray-700"> Data Portal</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Transparent, Accessible, Empowering Rural India
            </p>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <div className="metric-card metric-card-saffron">
                  <div className="text-5xl mb-2">🏛️</div>
                  <div className="text-3xl font-bold">{stats.totalDistricts || 0}</div>
                  <div className="text-sm opacity-90">Districts</div>
                </div>
                <div className="metric-card metric-card-green">
                  <div className="text-5xl mb-2">💼</div>
                  <div className="text-3xl font-bold">{((stats.totalJobs || 0) / 1000).toFixed(0)}K</div>
                  <div className="text-sm opacity-90">Jobs</div>
                </div>
                <div className="metric-card metric-card-gold">
                  <div className="text-5xl mb-2">💰</div>
                  <div className="text-3xl font-bold">₹{((stats.totalWages || 0) / 10000000).toFixed(0)}Cr</div>
                  <div className="text-sm opacity-90">Wages</div>
                </div>
                <div className="metric-card metric-card-blue">
                  <div className="text-5xl mb-2">🗺️</div>
                  <div className="text-3xl font-bold">{stats.totalStates || 0}</div>
                  <div className="text-sm opacity-90">States/UTs</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="govt-card text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-2">
                <span className="text-3xl">📍</span>
                <span>Auto-Detect Location</span>
              </h3>
              <p className="text-gray-600 mb-6">
                Let us automatically detect your location to show relevant data
              </p>
              <button
                onClick={detectLocation}
                disabled={detectingLocation}
                className="btn-govt-primary mx-auto"
              >
                {detectingLocation ? (
                  <>
                    <div className="spinner w-6 h-6"></div>
                    <span>Detecting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🎯</span>
                    <span>Detect My Location</span>
                  </>
                )}
              </button>
            </div>

            <div className="govt-card-green text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center space-x-2">
                <span className="text-3xl">📋</span>
                <span>Browse All Districts</span>
              </h3>
              <p className="text-gray-600 mb-6">
                View and filter data from all districts across India
              </p>
              <button
                onClick={() => navigate('/browse')}
                className="btn-govt-secondary mx-auto"
              >
                <span className="text-2xl">🔍</span>
                <span>Browse All Districts</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert-error mb-6">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          <div className="govt-card-blue">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-3">
              <span className="text-4xl">🗺️</span>
              <span>Select Your District / अपना जिला चुनें</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">
                  1️⃣ Select State / राज्य चुनें
                </label>
                <select
                  value={selectedState}
                  onChange={handleStateChange}
                  className="govt-select"
                  disabled={loading}
                >
                  <option value="">-- Select State --</option>
                  {states.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name} ({state.districtCount} districts)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-bold text-gray-700 mb-3">
                  2️⃣ Select District / जिला चुनें
                </label>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="govt-select"
                  disabled={!selectedState || loading}
                >
                  <option value="">-- Select District --</option>
                  {districts.map((district) => (
                    <option key={district.districtId} value={district.districtId}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && <Loading message="Loading data..." />}

            {selectedState && districts.length > 0 && (
              <div className="mt-6 alert-success">
                <p className="font-semibold">
                  ✅ Found {districts.length} districts in {selectedState}. Please select a district.
                </p>
              </div>
            )}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="govt-card text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-2 text-india-saffron">Real-Time Data</h3>
              <p className="text-gray-600">
                Access updated MGNREGA statistics from official government sources
              </p>
            </div>

            <div className="govt-card text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">🔊</div>
              <h3 className="text-2xl font-bold mb-2 text-india-green">Audio Support</h3>
              <p className="text-gray-600">
                Listen to data summaries in simple language for better understanding
              </p>
            </div>

            <div className="govt-card text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold mb-2 text-ashoka-blue">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access information easily from any device, anywhere
              </p>
            </div>
          </div>
        </div>
      </main>

      <GovtFooter />
    </div>
  );
};

export default Home;
