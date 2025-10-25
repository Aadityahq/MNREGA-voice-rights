import React from 'react';
import { useNavigate } from 'react-router-dom';
import DistrictSelector from '../components/DistrictSelector';

const Home = () => {
  const navigate = useNavigate();

  const handleDistrictSelect = (districtId) => {
    navigate(`/dashboard/${districtId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="hero-icon mb-6">🏛️</div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          हमारी आवाज़, हमारे अधिकार
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mb-6">
          Our Voice, Our Rights
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
          MGNREGA data made simple and accessible for everyone
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <div className="flex items-center space-x-2 bg-green-100 px-6 py-3 rounded-full">
            <span className="text-3xl">📊</span>
            <span className="text-lg font-semibold text-green-800">Real-time Data</span>
          </div>
          <div className="flex items-center space-x-2 bg-purple-100 px-6 py-3 rounded-full">
            <span className="text-3xl">🔊</span>
            <span className="text-lg font-semibold text-purple-800">Audio Support</span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-100 px-6 py-3 rounded-full">
            <span className="text-3xl">📱</span>
            <span className="text-lg font-semibold text-blue-800">Mobile Friendly</span>
          </div>
          <div className="flex items-center space-x-2 bg-orange-100 px-6 py-3 rounded-full">
            <span className="text-3xl">🌐</span>
            <span className="text-lg font-semibold text-orange-800">All Districts</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <DistrictSelector onDistrictSelect={handleDistrictSelect} />
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-2xl font-bold mb-2">Employment Data</h3>
          <p className="text-lg">Track jobs generated in your district</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-2xl font-bold mb-2">Wages Information</h3>
          <p className="text-lg">See how much wages were paid</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-8 rounded-2xl shadow-xl text-center">
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-2xl font-bold mb-2">Trends & History</h3>
          <p className="text-lg">View performance over months</p>
        </div>
      </div>
    </div>
  );
};

export default Home;