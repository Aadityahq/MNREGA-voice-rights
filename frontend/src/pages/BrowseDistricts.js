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
