#!/bin/bash

echo "🇮🇳 =================================================="
echo "   Government of India MGNREGA Frontend Setup"
echo "   =================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
cd ~/Desktop/Codes/MNREGA-voice-rights

echo -e "${YELLOW}📁 Step 1: Cleaning up old frontend...${NC}"
rm -rf frontend Frontend
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo -e "${YELLOW}📦 Step 2: Creating React app...${NC}"
npx create-react-app frontend
echo -e "${GREEN}✅ React app created${NC}"
echo ""

cd frontend

echo -e "${YELLOW}📚 Step 3: Installing dependencies...${NC}"
npm install react-router-dom@6 axios recharts
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}📝 Step 4: Creating directory structure...${NC}"
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/services
mkdir -p src/utils
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

echo -e "${YELLOW}🎨 Step 5: Creating configuration files...${NC}"

# ============================================
# TAILWIND CONFIG
# ============================================
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'india-saffron': '#FF9933',
        'india-white': '#FFFFFF',
        'india-green': '#138808',
        'india-blue': '#000080',
        'ashoka-blue': '#000080',
        'govt-gold': '#FFD700',
      },
      fontFamily: {
        'govt': ['Tiro Devanagari Hindi', 'serif'],
        'sans': ['Inter', 'Noto Sans', 'sans-serif']
      },
      backgroundImage: {
        'india-flag': 'linear-gradient(to bottom, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)',
        'govt-gradient': 'linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
      }
    },
  },
  plugins: [],
}
EOF

# ============================================
# .ENV FILE
# ============================================
cat > .env << 'EOF'
REACT_APP_API_URL=http://localhost:5001/api
EOF

# ============================================
# INDEX.CSS
# ============================================
cat > src/index.css << 'EOF'
@import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Inter', 'Noto Sans Devanagari', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

.govt-header {
  background: linear-gradient(135deg, #FF9933 0%, #FFFFFF 50%, #138808 100%);
  border-bottom: 4px solid #FFD700;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.govt-emblem {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.govt-card {
  @apply bg-white rounded-lg shadow-md border-l-4 border-india-saffron p-6 hover:shadow-xl transition-all duration-300;
}

.govt-card-green {
  @apply bg-white rounded-lg shadow-md border-l-4 border-india-green p-6 hover:shadow-xl transition-all duration-300;
}

.govt-card-blue {
  @apply bg-white rounded-lg shadow-md border-l-4 border-ashoka-blue p-6 hover:shadow-xl transition-all duration-300;
}

.metric-card {
  @apply p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer border-2;
  min-height: 180px;
}

.metric-card-saffron {
  @apply bg-gradient-to-br from-orange-400 to-orange-600 text-white border-orange-700;
}

.metric-card-green {
  @apply bg-gradient-to-br from-green-500 to-green-700 text-white border-green-800;
}

.metric-card-blue {
  @apply bg-gradient-to-br from-blue-600 to-blue-800 text-white border-blue-900;
}

.metric-card-gold {
  @apply bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-700;
}

.btn-govt-primary {
  @apply bg-india-saffron hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 text-lg;
}

.btn-govt-secondary {
  @apply bg-india-green hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 text-lg;
}

.btn-govt-blue {
  @apply bg-ashoka-blue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 text-lg;
}

.govt-select {
  @apply w-full px-6 py-4 text-lg border-3 border-india-saffron rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-600 bg-white font-semibold shadow-md;
}

.govt-input {
  @apply w-full px-6 py-4 text-lg border-3 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-india-saffron bg-white font-semibold shadow-md;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #FF9933;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.govt-badge {
  @apply inline-flex items-center px-4 py-2 rounded-full text-sm font-bold;
}

.govt-badge-saffron {
  @apply bg-orange-100 text-orange-800 border-2 border-orange-300;
}

.govt-badge-green {
  @apply bg-green-100 text-green-800 border-2 border-green-300;
}

.govt-badge-blue {
  @apply bg-blue-100 text-blue-800 border-2 border-blue-300;
}

.ashoka-chakra {
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out;
}

::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #FF9933, #138808);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #FF9933, #FFD700, #138808);
}

.alert-success {
  @apply bg-green-50 border-l-4 border-green-500 text-green-800 p-4 rounded-lg shadow-md;
}

.alert-error {
  @apply bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-lg shadow-md;
}

.alert-warning {
  @apply bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg shadow-md;
}

.alert-info {
  @apply bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg shadow-md;
}

.govt-footer {
  @apply bg-gradient-to-r from-gray-800 to-gray-900 text-white border-t-4 border-india-saffron;
}
EOF

echo -e "${GREEN}✅ Configuration files created${NC}"
echo ""

echo -e "${YELLOW}🔧 Step 6: Creating service files...${NC}"

# ============================================
# API SERVICE
# ============================================
cat > src/services/api.js << 'EOF'
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  getStates: async () => {
    try {
      const response = await apiClient.get('/states');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch states');
    }
  },

  getDistrictsByState: async (stateName, params = {}) => {
    try {
      const response = await apiClient.get(`/states/${encodeURIComponent(stateName)}/districts`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch districts');
    }
  },

  getAllDistricts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/districts', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch districts');
    }
  },

  getDistrictById: async (districtId) => {
    try {
      const response = await apiClient.get(`/districts/${districtId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch district data');
    }
  },

  getStatistics: async () => {
    try {
      const response = await apiClient.get('/statistics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
    }
  },

  getAudioSummary: async (districtId) => {
    try {
      const response = await apiClient.get(`/districts/${districtId}/audio-summary`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch audio summary');
    }
  },

  triggerDataFetch: async () => {
    try {
      const response = await apiClient.post('/fetch-data');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to trigger data fetch');
    }
  },
};

export default api;
EOF

echo -e "${GREEN}✅ Service files created${NC}"
echo ""

echo -e "${YELLOW}🎯 Step 7: Creating components...${NC}"

# ============================================
# GOVT HEADER COMPONENT
# ============================================
cat > src/components/GovtHeader.js << 'EOF'
import React from 'react';
import { useNavigate } from 'react-router-dom';

const GovtHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="govt-header">
      <div className="bg-india-flag h-2"></div>
      
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="govt-emblem">
                <div className="w-16 h-16 bg-ashoka-blue rounded-full flex items-center justify-center">
                  <span className="text-3xl ashoka-chakra">⚙️</span>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  <span className="text-india-saffron">भारत सरकार</span>
                  <span className="text-gray-700"> | </span>
                  <span className="text-india-green">Government of India</span>
                </h1>
                <p className="text-sm md:text-base font-semibold text-gray-700 mt-1">
                  महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम
                </p>
                <p className="text-xs md:text-sm text-gray-600">
                  Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-ashoka-blue hover:text-india-saffron font-semibold transition-colors"
              >
                🏠 Home
              </button>
              <button
                onClick={() => navigate('/browse')}
                className="text-ashoka-blue hover:text-india-saffron font-semibold transition-colors"
              >
                📋 Browse
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-india-saffron via-white to-india-green py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-gray-800">
            🗣️ हमारी आवाज़, हमारे अधिकार | Our Voice, Our Rights 🗣️
          </p>
        </div>
      </div>
    </header>
  );
};

export default GovtHeader;
EOF

# ============================================
# GOVT FOOTER COMPONENT
# ============================================
cat > src/components/GovtFooter.js << 'EOF'
import React from 'react';

const GovtFooter = () => {
  return (
    <footer className="govt-footer mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">About MGNREGA</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The Mahatma Gandhi National Rural Employment Guarantee Act aims to enhance livelihood 
              security in rural areas by providing at least 100 days of guaranteed wage employment 
              per year to every household.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://nrega.nic.in" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-300 hover:text-white transition-colors">
                  📍 Official MGNREGA Portal
                </a>
              </li>
              <li>
                <a href="https://rural.nic.in" target="_blank" rel="noopener noreferrer"
                   className="text-gray-300 hover:text-white transition-colors">
                  ��️ Ministry of Rural Development
                </a>
              </li>
              <li>
                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer"
                   className="text-gray-300 hover:text-white transition-colors">
                  🇮🇳 National Portal of India
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-india-saffron">Contact Information</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>📧 Email: support@mgnrega.gov.in</li>
              <li>📞 Toll-Free: 1800-XXX-XXXX</li>
              <li>🏢 Ministry of Rural Development</li>
              <li>📍 Krishi Bhawan, New Delhi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Government of India. All Rights Reserved.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Last Updated: {new Date().toLocaleDateString('en-IN')}</span>
              <span>|</span>
              <span>Version 1.0</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-gray-500">
            Developed with ❤️ for Rural India | Data from Official MGNREGA API
          </div>
        </div>
      </div>

      <div className="bg-india-flag h-2"></div>
    </footer>
  );
};

export default GovtFooter;
EOF

# ============================================
# LOADING COMPONENT
# ============================================
cat > src/components/Loading.js << 'EOF'
import React from 'react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="spinner mb-4"></div>
      <p className="text-xl text-gray-600 font-semibold">{message}</p>
    </div>
  );
};

export default Loading;
EOF

echo -e "${GREEN}✅ Components created${NC}"
echo ""

echo -e "${YELLOW}📄 Step 8: Creating pages...${NC}"

# ============================================
# HOME PAGE
# ============================================
cat > src/pages/Home.js << 'EOF'
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
EOF

# Will continue with remaining files...
echo -e "${BLUE}Creating Dashboard.js...${NC}"

# ============================================
# DASHBOARD PAGE (Part 1)
# ============================================
cat > src/pages/Dashboard.js << 'EOF'
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
EOF

echo -e "${BLUE}Creating BrowseDistricts.js...${NC}"

# ============================================
# BROWSE DISTRICTS PAGE
# ============================================
cat > src/pages/BrowseDistricts.js << 'EOF'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import GovtHeader from '../components/GovtHeader';
import GovtFooter from '../components/GovtFooter';
import Loading from '../components/Loading';

const BrowseDistricts = () => {
  const navigate = useNavigate();
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    state: '',
    search: '',
    sortBy: 'name',
    order: 'asc'
  });

  useEffect(() => {
    fetchStates();
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchDistricts();
  }, [filters]);

  const fetchStates = async () => {
    try {
      const response = await api.getStates();
      if (response.success) {
        setStates(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const response = await api.getAllDistricts(filters);
      if (response.success) {
        setDistricts(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      search: '',
      sortBy: 'name',
      order: 'asc'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GovtHeader />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate('/')} className="mb-6 text-ashoka-blue hover:text-india-saffron font-semibold text-lg">
            ← Back to Home
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <span className="text-5xl">📋</span>
            <span>Browse All Districts / सभी जिले देखें</span>
          </h1>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="metric-card metric-card-saffron">
                <div className="text-4xl mb-2">🏛️</div>
                <div className="text-3xl font-bold">{stats.totalDistricts || 0}</div>
                <div className="text-sm opacity-90">Total Districts</div>
              </div>
              <div className="metric-card metric-card-green">
                <div className="text-4xl mb-2">💼</div>
                <div className="text-3xl font-bold">{((stats.totalJobs || 0) / 1000).toFixed(0)}K</div>
                <div className="text-sm opacity-90">Total Jobs</div>
              </div>
              <div className="metric-card metric-card-gold">
                <div className="text-4xl mb-2">💰</div>
                <div className="text-3xl font-bold">₹{((stats.totalWages || 0) / 10000000).toFixed(0)}Cr</div>
                <div className="text-sm opacity-90">Total Wages</div>
              </div>
              <div className="metric-card metric-card-blue">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-3xl font-bold">{stats.totalStates || 0}</div>
                <div className="text-sm opacity-90">States/UTs</div>
              </div>
            </div>
          )}

          <div className="govt-card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <span className="text-3xl">🔍</span>
                <span>Filter Districts</span>
              </h3>
              <button onClick={clearFilters} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold">
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🗺️ State</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="govt-select"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state.name} value={state.name}>
                      {state.name} ({state.districtCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🔎 Search</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="District name..."
                  className="govt-input"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="govt-select"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="jobs">Jobs Generated</option>
                  <option value="wages">Wages Paid</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <Loading message="Loading districts..." />
          ) : districts.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-8xl">📭</span>
              <p className="text-2xl text-gray-600 mt-4">No districts found</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-center">
                <p className="text-xl font-semibold text-gray-700">
                  📊 Showing {districts.length} districts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {districts.map((district) => {
                  const latest = district.monthlyMetrics[district.monthlyMetrics.length - 1] || {};
                  
                  return (
                    <div
                      key={district._id}
                      onClick={() => navigate(`/dashboard/${district.districtId}`)}
                      className="govt-card cursor-pointer transform hover:scale-105"
                    >
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2 mb-2">
                        <span className="text-3xl">🏛️</span>
                        <span>{district.name}</span>
                      </h3>
                      <p className="text-gray-600 font-semibold mb-4">{district.state}</p>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-green-50 p-2 rounded">
                          <span className="text-gray-700 font-semibold">💼 Jobs:</span>
                          <span className="text-green-700 font-bold">{latest.jobsGenerated?.toLocaleString() || '0'}</span>
                        </div>

                        <div className="flex justify-between items-center bg-yellow-50 p-2 rounded">
                          <span className="text-gray-700 font-semibold">💰 Wages:</span>
                          <span className="text-orange-700 font-bold">₹{(latest.wagesPaid / 10000000).toFixed(2)}Cr</span>
                        </div>

                        <div className="flex justify-between items-center bg-blue-50 p-2 rounded">
                          <span className="text-gray-700 font-semibold">📅 Workdays:</span>
                          <span className="text-blue-700 font-bold">{latest.workdays?.toLocaleString() || '0'}</span>
                        </div>
                      </div>

                      <button className="w-full mt-4 bg-india-saffron text-white py-2 rounded-lg hover:bg-orange-600 font-semibold">
                        View Dashboard →
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <GovtFooter />
    </div>
  );
};

export default BrowseDistricts;
EOF

echo -e "${GREEN}✅ Pages created${NC}"
echo ""

echo -e "${YELLOW}⚛️ Step 9: Creating App.js...${NC}"

# ============================================
# APP.JS
# ============================================
cat > src/App.js << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BrowseDistricts from './pages/BrowseDistricts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:districtId" element={<Dashboard />} />
        <Route path="/browse" element={<BrowseDistricts />} />
      </Routes>
    </Router>
  );
}

export default App;
EOF

# ============================================
# INDEX.JS
# ============================================
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo -e "${GREEN}✅ App files created${NC}"
echo ""

echo -e "${YELLOW}🌐 Step 10: Updating public/index.html...${NC}"

# ============================================
# PUBLIC/INDEX.HTML
# ============================================
cat > public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#FF9933" />
    <meta name="description" content="Government of India - MGNREGA Data Portal. Transparent, Accessible, Empowering Rural India." />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>" />
    <title>MGNREGA Data Portal | भारत सरकार | Government of India</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this application.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

echo -e "${GREEN}✅ index.html updated${NC}"
echo ""

echo -e "${YELLOW}�� Step 11: Cleaning up...${NC}"

# Remove default files
rm -f src/App.test.js
rm -f src/logo.svg
rm -f src/reportWebVitals.js
rm -f src/setupTests.js
rm -f src/App.css

echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo -e "${GREEN}=================================================="
echo "✅ Government of India Frontend Setup Complete!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "   - React app created"
echo "   - Tailwind CSS configured"
echo "   - Government theme applied"
echo "   - All components created"
echo "   - All pages created"
echo "   - API service configured"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "   1. Start backend: cd ../backend && npm run dev"
echo "   2. Start frontend: npm start"
echo "   3. Open: http://localhost:3000"
echo ""
echo -e "${GREEN}🇮🇳 Jai Hind! Your Government Portal is Ready! 🇮🇳${NC}"
