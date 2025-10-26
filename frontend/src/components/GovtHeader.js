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
